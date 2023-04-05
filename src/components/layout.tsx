import React from "react";
import type { PropsWithChildren } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
const Banner = () => {
  return (
    <div className="fixed bottom-0 w-full py-2 bg-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-[minmax(0,1fr),minmax(0,2fr),minmax(0,1fr)] items-center h-full w-full">
          <div></div>
          <div className="text-left">
            <p className="text-sm">Your message goes here</p>
          </div>
          <div className="text-right">
            <SignInButton className="px-4 py-1 bg-blue-700 rounded-md mr-2 hover:bg-blue-800"/>

            {/* <button >
              Sign In
            </button> */}
            <button className="px-4 py-1 bg-blue-700 rounded-md hover:bg-blue-800">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export const PageLayout = (props: PropsWithChildren) => {
  
  const { isLoaded: userLoaded, isSignedIn } = useUser()
  return (
    <main className="flex h-full w-full justify-center">
      {
        !isSignedIn && <Banner />
      }
      <div
        className=" flex flex-row h-full justify-start w-full"
      >
        {props.children}
      </div>  
    </main>
  );
};
