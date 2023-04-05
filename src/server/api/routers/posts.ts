import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

import filterUserForClient from "~/server/helpers/filterUserForClient";
import type { Post } from "@prisma/client";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";


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
            .then(addUserDataToPosts)
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
    like: privateProcedure.input(z.object({
        postId: z.string(),
      })).mutation(async ({ ctx, input }) => {
            const userId = ctx.userId;

            // Check if the user has already liked the post
            const existingLike = await ctx.prisma.like.findUnique({
            where: {
                postId_userId: {
                postId: input.postId,
                userId: userId,
                },
            },
            });

            if (existingLike) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You have already liked this post.",
            });
            }

            // Create a new like
            const like = await ctx.prisma.like.create({
            data: {
                postId: input.postId,
                userId: userId,
            },
            });

            return like;
        }),
})
