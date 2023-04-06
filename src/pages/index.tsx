import React, { useRef, useEffect } from 'react';
import { Nav } from '~/components/nav';
import { useUser } from "@clerk/nextjs";
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
import { Sidebar } from '~/components/sidebar';

const CreatePostWizard = () => {
  const { user } = useUser();
  const [ input, setInput ] = useState<string>('')
  const [ showEmojiPicker, setShowEmojiPicker ] = useState<boolean>(false)

  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const { scroll, setScroll } = useGlobal()
  
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
      <div className="relative flex flex-col">
        {
          showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute transform translate-y-20" >
              <EmojiPicker onEmojiClick={(value)=> {
                setInput(input+value.emoji)
                // setShowEmojiPicker(false)
              }}/>
            </div>
          )
        }
        <div className="flex flex-row gap-3 w-full p-4 border-b border-opacity-20 border-white">
          <img 
            src={user.profileImageUrl} 
            alt="Profile Image"
            className="h-12 w-12 rounded-full gap-3"
          />
          <div className="flex flex-col justify-center align-middle">
            <AiOutlineSmile size={20} className="hover:text-green-500" onClick={()=> {
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
    <div className="flex flex-col h-full">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}

const useScroll = () => {
  const { scroll, setScroll } = useGlobal();
  console.log("SCROLL: ", scroll);
  let timer = null;

  const handleScroll = () => {
    setScroll(true);

    // Clear any existing timer
    if (timer) {
      clearTimeout(timer);
    }

    // Set a new timer to update the scroll state to false after 100ms
    timer = setTimeout(() => {
      setScroll(false);
    }, 100);
  };

  useEffect(() => {
    // Attach the event listeners
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setScroll, scroll]);

  return { global: [scroll, setScroll] };
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();
  const { global } = useScroll();

  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <Nav />
      <div className="grid grid-cols-2 w-full" style={{gridTemplateColumns: "55% 45%"}}>
        {/* Main content */}
        <div className="col-span-1 mr-3"> 
        <div className="flex flex-col justify-start">
          <div className="sticky w-full top-0 bg-black bg-opacity-70 text-white shadow-md z-10 border-b border-opacity-20 border-white flex flex-col justify-between backdrop-blur-md">
            <div className="flex flex-col justify-center text-lg gap-3 h-12 p-4">
              <h1 className="">HOME</h1>
            </div>
            <div className="container mx-auto">
              <div className="flex justify-end items-end h-12">
                <button className="transition duration-600 w-1/2 h-full text-sm font-semibold bg-gray-400 bg-opacity-0 hover:bg-opacity-10">
                  General
                </button>
                <button className="transition duration-600 w-1/2 h-full text-sm font-semibold bg-gray-400 bg-opacity-0 hover:bg-opacity-10">
                  Subscribed
                </button>
              </div>
            </div>
          </div>
          <div className="sticky">
            <CreatePostWizard />
          </div>
            <Feed />
          </div>
        </div>
        <div className="col-span-1"> {/* 40% width */}
        <div className="h-full w-full">
          <Sidebar />
        </div>
        {/* content */}
      </div>
        
        {/* Sidebar */}
        
      </div>
    </PageLayout>
  );
};


export default Home;