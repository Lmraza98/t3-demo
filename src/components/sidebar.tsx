import React, { useRef } from 'react';
import { FiSearch, FiMoreHorizontal } from 'react-icons/fi';
import { useState, useEffect } from 'react';


export const Sidebar = () => {
    return (
        <div className="w-full flex flex-col h-full"> {/* Add this wrapper div */}
        <div  className="top-0  sticky z-10 bg-black  w-10/12 h-10"> {/* Fixed container */}
                <div className="relative">
                    <input
                    type="text"
                    className="w-full h-10 pl-8 pr-3 rounded-3xl text-sm bg-dark focus:outline-none focus:bg-black focus:ring-1 focus:ring-blue-500"
                    placeholder="Search T3 Demo"
                    />
                    <span className="absolute left-0 top-0 mt-3 ml-3 text-gray-400">
                    <FiSearch />
                    </span>
                </div>
                </div>
            <div 
                className="sticky top-0 w-inherit bg-transparent p-4 pl-8 rounded-md shadow-md border-l border-opacity-20 border-white flex flex-col gap-3 overflow-y-auto"
            >
                {/* Search bar */}
                
                {/* Updates section */}
                <div className="flex flex-col gap-3">
                <div className="bg-dark rounded-xl w-10/12">
                    <h2 className="text-xl font-semibold mb-2 p-3 w-full">Updates</h2>
                    <ul className="flex flex-col items-start ">
                        <li className="flex flex-row p-3 h-full w-full justify-between align-top">
                            <div className='flex flex-col'>
                                <p className="text-sm text-gray-600">Update description...</p>
                                <h3 className="font-semibold">Update Title</h3>
                            </div>
                            <div className='self-start justify-end p-1'>
                                <FiMoreHorizontal/>
                            </div>
                        </li>
                        <li className="flex flex-row p-3 h-full w-full justify-between align-top">
                            <div className='flex flex-col'>
                                <p className="text-sm text-gray-600">Update description...</p>
                                <h3 className="font-semibold">Update Title</h3>
                            </div>
                            <div className='self-start justify-end p-1'>
                                <FiMoreHorizontal/>
                            </div>
                        </li>
                        <li className="flex flex-row p-3 h-full w-full justify-between align-top">
                            <div className='flex flex-col'>
                                <p className="text-sm text-gray-600">Update description...</p>
                                <h3 className="font-semibold">Update Title</h3>
                            </div>
                            <div className='self-start justify-end p-1'>
                                <FiMoreHorizontal/>
                            </div>
                        </li>
                        <li className="flex flex-row p-3 h-full w-full justify-between align-top">
                            <div className='flex flex-col'>
                                <p className="text-sm text-gray-600">Update description...</p>
                                <h3 className="font-semibold">Update Title</h3>
                            </div>
                            <div className='self-start justify-end p-1'>
                                <FiMoreHorizontal/>
                            </div>
                        </li>
                        <li className="flex flex-row p-3 h-full w-full justify-between align-top">
                            <div className='flex flex-col'>
                                <p className="text-sm text-gray-600">Update description...</p>
                                <h3 className="font-semibold">Update Title</h3>
                            </div>
                            <div className='self-start justify-end p-1'>
                                <FiMoreHorizontal/>
                            </div>
                        </li>
                        <li className="flex flex-row p-3 h-full w-full justify-between align-top">
                            <div className='flex flex-col'>
                                <p className="text-sm text-gray-600">Update description...</p>
                                <h3 className="font-semibold">Update Title</h3>
                            </div>
                            <div className='self-start justify-end p-1'>
                                <FiMoreHorizontal/>
                            </div>
                        </li>
                        <li className="flex flex-row p-3 h-full w-full justify-between align-top">
                            <div className='flex flex-col'>
                                <p className="text-sm text-gray-600">Update description...</p>
                                <h3 className="font-semibold">Update Title</h3>
                            </div>
                            <div className='self-start justify-end p-1'>
                                <FiMoreHorizontal/>
                            </div>
                        </li>
                    {/* Add more updates as needed */}
                    </ul>
                </div>
                    {/* Popular Accounts section */}
                <div className="bg-dark p-4 rounded-xl w-10/12">
                    <h2 className="text-xl font-semibold mb-2">Popular Accounts</h2>
                    <ul className="space-y-1 flex flex-col gap-3">
                        <li className="flex items-center space-x-2">
                            <img
                                src="https://via.placeholder.com/48"
                                alt="Avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <h3 className="font-semibold">@username</h3>
                                <p className="text-sm text-gray-600">User description...</p>
                            </div>
                        </li>
                        <li className="flex items-center space-x-2">
                            <img
                                src="https://via.placeholder.com/48"
                                alt="Avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <h3 className="font-semibold">@username</h3>
                                <p className="text-sm text-gray-600">User description...</p>
                            </div>
                        </li>
                        <li className="flex items-center space-x-2">
                            <img
                                src="https://via.placeholder.com/48"
                                alt="Avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <h3 className="font-semibold">@username</h3>
                                <p className="text-sm text-gray-600">User description...</p>
                            </div>
                        </li>
                    </ul>
                </div>

                </div>
            </div>
        </div>
    );
};
