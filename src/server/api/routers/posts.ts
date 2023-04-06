import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure, type Context } from "~/server/api/trpc";

import filterUserForClient from "~/server/helpers/filterUserForClient";
import type { Post } from "@prisma/client";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";


// const addUserDataToPosts = async (ctx:(typeof createTRPCContext), posts: Post[]) => {
//     const users = (
//         await clerkClient.users.getUserList({
//           userId: posts.map((post) => post.authorId),
//           limit: 100,
//         })
//       ).map(filterUserForClient);
    
//       return posts.map(async (post) => {
//         const author = users.find((user) => user.id === post.authorId);
//         if (!author) {
//           throw new TRPCError({
//             code: 'INTERNAL_SERVER_ERROR',
//             message: "Author for post not found",
//           });
//         }
    
//         // Fetch the likes count for the post
//         // const likesCount = await ctx.prisma.like.count({
//         //   where: { postId: post.id },
//         // });
    
//         return {
//           post,
//           author: {
//             ...author,
//             username: author.username,
//           },
//         //   likesCount, // Add the likes count to the response
//         };
//       });
//     };
    const addLikesToPost = (ctx: Context, posts: Post[]) => {
        return posts.map(async (post) => {
            // Fetch the likes count for the post
            const likes = await ctx.prisma.like.findMany({
                where: { postId: post.id },
            });
            if(!likes) {
                return {post, likes: 0}
            }
            return {
                post,
                likes
            }
        })
    }
            













    const addUserDataToPosts = async (posts: Post[]) => {
        const users = (
            await clerkClient.users.getUserList({
                userId: posts.map((post) => post.authorId),
                limit: 100
            })
        ).map(filterUserForClient)
    
        console.log(users)
    
        return posts.map((post) => {
            console.log("POST", post)
            const author = users.find((user) => user.id === post.authorId)
            console.log("AUTHOR" ,author)
            if (!author) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: "Author for post not found"
                })
            }

        
            return {
                post,
                author: {
                    ...author,
                    username: author.username
                }
            }
        })
    }

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true
});

export const postsRouter = createTRPCRouter({
    getById: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .query( async({ctx, input}) => {
            const post = await ctx.prisma.post.findUnique({
                where: {
                    id: input.id
                },
            })
            if (!post) throw new TRPCError({ code: "NOT_FOUND" })

            return (await addUserDataToPosts([post]))[0]
        }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            take: 100,
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        });
        return addUserDataToPosts(posts)
    }),
    getPostsByUserId: publicProcedure
        .input(
        z.object({
            userId: z.string(),
        })
        )
        .query(({ ctx, input }) =>
        ctx.prisma.post
            .findMany({
            where: {
                authorId: input.userId,
            },
            take: 100,
            orderBy: [{ createdAt: "desc" }],
            })
            .then((post) => addUserDataToPosts(post))
        ),

    create: privateProcedure.input(z.object({
        content: z.string().emoji("Only emojis are allowed here!!!").min(1).max(200)
    })).mutation(async ({ ctx, input }) => {
        const authorId = ctx.userId

        const { success } = await ratelimit.limit(authorId)

        if(!success) throw new TRPCError ({ code: "TOO_MANY_REQUESTS"})

        const post = await ctx.prisma.post.create({
            data: {
                authorId,
                content: input.content
            }
        })
        return post
    }),
    like: publicProcedure.input(
        z.object({
          postId: z.string(),
        })
      ).mutation(async ({ ctx, input }) => {
        const userId = ctx.userId || '1';
      
        // Check if the user has already liked the post
        const existingLike = await ctx.prisma.like.findFirst({
          where: {
            postId: input.postId,
            userId: userId,
          },
        });
      
        let message;
      
        if (existingLike) {
          await ctx.prisma.like.delete({
            where: {
              postId_userId: {
                postId: input.postId,
                userId: userId,
              },
            },
          });
          message = "Like removed.";
        } else {
          // Create a new like
          await ctx.prisma.like.create({
            data: {
              postId: input.postId,
              userId: userId,
            },
          });
          message = "Like added.";
        }
      
        // Fetch the updated likes count for the post
        const likesCount = await ctx.prisma.like.count({
          where: { postId: input.postId },
        });
      
        return {
          message,
          likesCount,
        };
      }),
})
