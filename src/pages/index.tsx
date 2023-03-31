import React, { useRef, useEffect } from 'react';
import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { PostView } from "~/components/postview";
import { api } from "~/utils/api";
import EmojiPicker from 'emoji-picker-react';
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { AiOutlineSmile } from 'react-icons/ai';
import { useGlobal } from "~/contexts/global"
const CreatePostWizard = () => {
  const { user } = useUser();
  const [ input, setInput ] = useState<string>('')

  const emojiPickerRef = useRef<HTMLDivElement>(null)
  
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

  const [ showEmojiPicker, setShowEmojiPicker ] = useState<boolean>(false)

  const { scroll, setScroll } = useGlobal()

  console.log("SCROLL: ", scroll)
  useEffect(() => {
    if(scroll)
    {
      setShowEmojiPicker(false)
    }
    return () => {
      setScroll(false)  
    }

  }, [scroll])
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);
  
  if(!user) return null
  

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <div className="relative flex flex-col h-28">
        {
          showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute transform translate-y-28" >
              <EmojiPicker onEmojiClick={(value)=> {
                setInput(input+value.emoji)
                // setShowEmojiPicker(false)
              }}/>
            </div>
          )
        }
        <h1 className="text-lg">HOME</h1>
        <div className="flex flex-row gap-3 w-full p-4">
          <img 
            src={user.profileImageUrl} 
            alt="Profile Image"
            className="h-14 w-14 rounded-full gap-3"
          />
          
          <div className="flex flex-col justify-center align-middle">
            <AiOutlineSmile onClick={()=> {
                setShowEmojiPicker(!showEmojiPicker)
            }}/>
          </div>
          <div className="flex flex-col w-full">
            <input 
              placeholder="Type some emojis!" 
              className="grow bg-transparent outline-none w-full"
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
          </div>
          <div id="menu-button" aria-expanded="true" aria-haspopup="true" aria-controls="menu">
            <div className="flex flex-row gap-3 w-full pl-20">
            
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
            </div>
            
           
          </div>
        </div>
        
      </div>
      
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
        <div className="flex flex-col border-b border-slate-400">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton/>
              </div>
            )}
            {isSignedIn && <CreatePostWizard/>}
        </div>
        <Feed/>
      </PageLayout>
  );
};

export default Home;