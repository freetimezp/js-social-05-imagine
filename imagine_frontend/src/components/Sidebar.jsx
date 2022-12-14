import React from 'react';
import { NavLink, Link } from 'react-router-dom';

import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import logo from '../assets/logo.png';
import { categories } from '../utils/data';

const isNotActiveStyle = 'flex items-center px-5 gap-3 transition-all duration-200 ease-in-out capitalize'
+ ' text-gray-500 hover:text-black';
const isActiveStyle = 'flex items-center px-5 gap-3 transition-all duration-200 ease-in-out capitalize'
+ ' font-extrabold text-blue-500 border-r-2 border-blue-500';

const Sidebar = ({ user, closeToggle }) => {
    const handleCloseSidebar = () => {
        if(closeToggle) {
            closeToggle(false);
        }
    }

    return (
        <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
            <div className="flex flex-col">
                <Link 
                    to="/" 
                    className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
                    onClick={handleCloseSidebar}
                >
                    <img src={logo} alt="logo" className="w-full" />
                </Link>
                <div className="flex flex-col gap-5">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => (isActive ? isActiveStyle + ' text-black' : isNotActiveStyle)}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill /> 
                        Home
                    </NavLink>
                    <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover categories</h3>
                    {categories?.slice(0, categories.length - 1).map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                            onClick={handleCloseSidebar}
                            key={category.name}
                        >
                            <img 
                                src={category.image} 
                                alt="category" 
                                className="w-10 h-10 rounded-full shadow-md"
                            />
                            <span className="transition-all hover:ml-2">{category.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            {user && (
                <Link 
                    to={`user-profile/${user._id}`}
                    className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
                    onClick={handleCloseSidebar}
                >
                    <img src={user.image} alt="user" className="h-10 w-10 rounded-full" />
                    <p>{user.userName}</p>
                </Link>
            )}
        </div>
    )
}

export default Sidebar;
