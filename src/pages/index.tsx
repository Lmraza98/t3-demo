import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image"

import { api, RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const [input, setInput ] = useState<string>('')

  const ctx = api.useContext()

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: (data) => {
      setInput('')
      void ctx.posts.getAll.invalidate()
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if(errorMessage && errorMessage[0]){
        toast.error(errorMessage[0])
      } else {
        toast.error("Failed to post! Please try again later.")
      }
    }
  })
  console.log(user)
  if(!user) return null

  return (
    <div className="flex gap-3 w-full p-4">
      <img 
        src={user.profileImageUrl} 
        alt="Profile Image"
        className="h-14 w-14 rounded-full gap-3"
      />
      <input 
        placeholder="Type some emojis!" 
        className="grow bg-transparent outline-none"
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e)=> {
          if (e.key === "Enter"){
            e.preventDefault()
            if( input !== "") {
              mutate({ content: input })
            }
          }
        }}
        disabled={isPosting}
      />
      {
        input !=="" && !isPosting && (
          <button 
            onClick={() => { mutate({ content: input })}}
            disabled={isPosting}
          >
            Post
          </button>
        )
      }
      {
        isPosting && (
          <div className="flex items-center justify-center">
            <LoadingSpinner size={20}/>
          </div>
        )
      }
    </div>
  )
}
type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image 
        alt={`@${author.username}'s profile picture`} 
        width={56} 
        height={56} 
        src={author.profileImageUrl} 
        className="h-14 w-14 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-400">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username!}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{
          post.content
        }</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()
  if(postsLoading) return <LoadingPage />

  if(!data) return <div>Something went wrong...</div>

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser()

  api.posts.getAll.useQuery()

  if (!userLoaded) return <div/>
  
  return (
      <PageLayout>
        <div className="flex flex-col border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton/>
              </div>
            )}
            {isSignedIn && <CreatePostWizard/>}
          <Feed/>
        </div>
      </PageLayout>
  );
};

export default Home;
