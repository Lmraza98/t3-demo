import Link from 'next/link';
import Image from 'next/image'
import { useState } from 'react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { FiHome, FiHash, FiBell, FiMail, FiBookmark, FiUser, FiMoreHorizontal } from 'react-icons/fi';
import { CSSTransition } from 'react-transition-group';

const LogoutMenu: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div className="relative">
      <button
        className="focus:outline-none"
        onClick={toggleMenu}
        aria-haspopup="true"
        aria-expanded={menuVisible}
      >
        <FiMoreHorizontal/>
      </button>
      <CSSTransition
        in={menuVisible}
        timeout={150}
        classNames={{
          enter: 'opacity-0',
          enterActive: 'opacity-100',
          exit: 'opacity-100',
          exitActive: 'opacity-0',
        }}
        unmountOnExit
      >
        <div className="absolute right-0 bottom-full mb-6 w-64 bg-black shadow-glow rounded-2xl p-2 pt-4 text-white z-10">
          <ul className="space-y-1">
            <li>
              <SignOutButton/>
            </li>
            
          </ul>
        </div>
      </CSSTransition>
    </div>
  );
}
export const Nav: React.FC = () => {
  const { user } = useUser();
  if (!user) {
    return (
      <div className="flex flex-col w-full  border-r border-opacity-20 border-white">
        {/* Twitter logo */}
        <div className="flex justify-end h-16 px-4">
        <div className="flex items-center w-3/4 px-6 gap-3">
          <Link href="/">
              T3
          </Link>
        </div>
        
      </div>
  
        {/* Sidebar links */}
        <nav className="flex flex-row justify-end ">
          <ul className="flex flex-col justify-start space-y-1 w-3/4 align-end gap-3">
            <li className="flex items-center justify-start h-12 px-4 ">
              <Link href="/">
                <div className="flex items-center gap-3 rounded-full h-12 px-4 hover:bg-gray-100 hover:text-black" >
                  <FiHome className="text-xl" />
                  <span className="text-xl">Home</span>
                </div>
              </Link>
            </li>
            <li className="flex items-center justify-start h-12 px-4">
              <Link href="/">
              <div className="flex items-center gap-3 rounded-full h-12 px-4 hover:bg-gray-100 hover:text-black" >
                  <FiHash className="text-xl" />
                  <span className="text-xl">Explore</span>
                </div>
              </Link>
            </li>
           <li className="flex items-center justify-start h-12 px-4">
              <Link href="/">
              <div className="flex items-center gap-3 rounded-full h-12 px-4 hover:bg-gray-100 hover:text-black" >
                  <FiUser className="text-xl" />
                  <span className="text-xl">Profile</span>
              </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
  
  return (
        <div className="flex flex-col w-1/3 h-screen border-r border-opacity-20 border-white">
            <div className='fixed top-0'>
        {/* Twitter logo */}
        <div className="flex justify-end h-16 px-4">
            <div className="flex items-center w-3/4 px-6 gap-3">
            <Link href="/">
                T3 Demo
            </Link>
            </div>
        </div>
        <div className="flex-grow">
        <nav className="flex flex-row justify-end">
            <ul className="space-y-1 w-3/4 align-end">
            <li className="flex items-center justify-start p-2 ">
                <Link href="/">
                <div className="flex items-center gap-3 rounded-full p-4 hover:bg-opacity-10 hover:bg-gray-400 " >
                    <FiHome className="text-3xl" />
                    <span className="text-xl  font-semibold">Home</span>
                </div>
                </Link>
            </li>
            <li className="flex items-center justify-start p-2">
                <Link href="/">
                <div className="flex items-center gap-3 rounded-full p-4 hover:bg-opacity-10 hover:bg-gray-400 " >
                    <FiHash className="text-3xl" />
                    <span className="text-xl">Explore</span>
                </div>
                </Link>
            </li>
            <li className="flex items-center justify-start p-2">
                <Link href="/">
                <div className="flex items-center gap-3 rounded-full p-4 hover:bg-opacity-10 hover:bg-gray-400 " >
                    <FiBell className="text-3xl" />
                    <span className="text-xl">Notifications</span>
                </div>
                </Link>
            </li>
            <li className="flex items-center justify-start p-2">
                <Link href="/">
                <div className="flex items-center gap-3 rounded-full p-4 hover:bg-opacity-10 hover:bg-gray-400 " >
                    <FiMail className="text-3xl" />
                    <span className="text-xl">Messages</span>
                </div>
                </Link>
            </li>
            <li className="flex items-center justify-start p-2">
                <Link href="/">
                <div className="flex items-center gap-3 rounded-full p-4 hover:bg-opacity-10 hover:bg-gray-400 " >
                    <FiBookmark className="text-3xl" />
                    <span className="text-xl">Bookmarks</span>
                </div>
                </Link>
            </li>
            <li className="flex items-center justify-start p-2">
                <Link href="/">
                <div className="flex items-center gap-3 rounded-full p-4 hover:bg-opacity-10 hover:bg-gray-400" >
                    <FiUser className="text-3xl" />
                    <span className="text-xl">Profile</span>
                </div>
                </Link>
            </li>
            </ul>
        </nav>
        </div>
        
        <div className='self-bottom'>
        <div className="flex flex-row  w-full p-4  justify-end">
            <div className="space-y-1 w-3/4 align-end">
            <div className="flex items-center justify-start w-full p-4 gap-3 rounded-full hover:bg-opacity-10 hover:bg-gray-400">
                <Image 
                src={user.profileImageUrl ?? "https://www.gravatar.com/avatar/"} 
                width={40}
                height={40}
                alt="Profile Image"
                className="h-10 w-10 rounded-full gap-3"
                />
                <div className="flex flex-col flex-grow">
                <div>
                {
                    user.firstName && <span className="text-sm">{user.firstName} {user.lastName}</span>
                }
                </div>
                <div>
                {
                    user.username && <span className="text-sm">@{user.username}</span>
                }
                </div>
                </div>
                <LogoutMenu/>
            </div>
            </div>
        </div>
        </div>
        
        </div>
    </div>
    
  );
};
