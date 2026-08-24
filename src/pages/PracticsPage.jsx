import { ArrowDown, ArrowDownAZ, ArrowDownCircle, LocateIcon, Map, MapIcon, MapPin } from 'lucide-react'
import React from 'react'
import { BiCaretDown } from 'react-icons/bi'
import { FaLocationArrow, FaLocationCrosshairs, FaLocationDot, FaLocationPin } from 'react-icons/fa6'
import { IoCarOutline, IoCartOutline } from 'react-icons/io5'
import { Link, NavLink } from 'react-router-dom'

export default function PracticsPage() {
    return (
        <>
            <Navbar />

        </ >
    )
}


function Navbar() {
    const isLogined = false;
    
    return (
        <div className='py-3 px-6 shadow-2xl'>
            <div className=' max-w-6xl mx-auto flex justify-between items-center '>
                <div className='flex items-center gap-7'>
                    <span className='font-bold font-sans'>
                        <span className=' text-red-500 text-2xl'>C</span>ampus Mind
                    </span>
                    <div className='flex items-center gap-1 text-gray-700'>
                        <MapPin size={20} color='red' />
                        <div className='flex items-center justify-center gap-2 cursor-pointer'>
                            <span className='font-semibold'>Add Address</span>
                            <BiCaretDown />
                        </div>


                    </div>
                </div>
                <div>
                    <nav className='flex gap-7 items-center'>
                        <ul className='flex gap-7 items-center text-xl font-serif '>
                            <NavLink to={"/"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : "text-black"} cursor-pointer`}>
                                <li>Home</li>
                            </NavLink>
                            <NavLink to={"/about"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : "text-black"} cursor-pointer`}>
                                <li>About</li>
                            </NavLink>
                            <NavLink to={"/contact"} className={({ isActive }) => `${isActive ? "border-b-3 transition-all border-red-500" : "text-black"} cursor-pointer`}>
                                <li>Contact</li>
                            </NavLink>
                        </ul>
                        <Link to="#" className='relative'>
                            <IoCartOutline className='w-7 h-7' />
                            <span className='bg-red-500 absolute px-1 rounded-full -top-3 -right-3 text-white'>10</span>
                        </Link>
                        <div className='bg-red-500 p-2 rounded-lg'>
                            <Link>
                                <span>{isLogined ? "Logout" : "Login"}</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}
