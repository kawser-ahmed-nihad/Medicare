import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
    return (
        <div className='fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm'> 

            <nav className='flex max-w-7xl  mx-auto justify-between items-center px-4 py-6'>
                <div className='flex items-center gap-1'>
                    <img className="h-9 w-9" src="/public/logo-icon-bg.svg" alt="Logo" />
                    <h1 className="text-xl font-bold">Medicare</h1>
                </div>

                <div>
                    <ul className='flex text-[15px] font-semibold  items-center gap-9 text-[#4A5568]'>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/find-doctors">Services</NavLink></li>
                        <li><NavLink to="/find-doctors">Doctors</NavLink></li>
                        <li><NavLink to="/find-doctors">Blog</NavLink></li>
                        <li><NavLink to="/about">About</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                    </ul>
                </div>

                <div>
                    <button
                        className="
   bg-[#1A73E8]
    text-white font-semibold
    px-4 py-2.5
    cursor-pointer
    rounded-full

  "
                    >
                        Book Appointment
                    </button>

                </div>
            </nav>

        </div>
    )
}

export default Navbar