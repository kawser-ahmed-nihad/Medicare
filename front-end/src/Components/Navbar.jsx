import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import {
    LogOut, Menu, X, LayoutDashboard,

    User,
    ChevronRight,
} from 'lucide-react'
import useAuth from '../hooks/useAuth'
import Swal from 'sweetalert2'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showNavbar, setShowNavbar] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const { user, logout, loading } = useAuth();


    const [dropdownOpen, setDropdownOpen] = useState(false);


    // Navbar hide/show on scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY <= 20) {
                setShowNavbar(true)
            } else if (currentScrollY > lastScrollY) {
                setShowNavbar(false)
                setMenuOpen(false)
            } else {
                setShowNavbar(true)
            }

            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [lastScrollY])

    // console.log(user)

    const handleLogOut = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out!",
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                Swal.fire("Logged out!", "", "success");
            }
        });
    };

    // 1. Loading state
    // if (loading) {
    //     return (
    //         <div className="flex justify-end items-center py-2">
    //             <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin"></div>
    //         </div>
    //     );
    // }

    return (
        <div
            className={`
                fixed top-0 left-0 w-full z-50
                bg-transparent backdrop-blur-sm
                transition-all duration-500 ease-in-out
                ${showNavbar
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-full opacity-0'
                }
            `}
        >

            <nav className='flex max-w-7xl mx-auto justify-between items-center px-4 sm:px-6 lg:px-8 py-4 md:py-5 lg:py-6'>

                {/* Logo */}
                <Link
                    to='/'
                    className='flex items-center gap-1'>
                    <img
                        className="h-9 w-9"
                        src="/logo-icon-bg.svg"
                        alt="Logo"
                    />

                    <h1 className="text-xl font-bold">
                        Medicare
                    </h1>
                </Link>


                {/* Desktop / Tablet Navigation */}
                <div className='hidden md:block'>
                    <ul className='flex text-[14px] lg:text-[15px] font-semibold items-center gap-5 lg:gap-7 xl:gap-9 text-[#4A5568]'>

                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => `
                                    relative py-2 transition-all duration-300
                                    ${isActive
                                        ? 'text-[#1A73E8]'
                                        : 'hover:text-[#1A73E8]'
                                    }

                                    after:absolute
                                    after:left-0
                                    after:bottom-0
                                    after:h-[2px]
                                    after:bg-[#1A73E8]
                                    after:rounded-full
                                    after:transition-all
                                    after:duration-300

                                    ${isActive
                                        ? 'after:w-full'
                                        : 'after:w-0 hover:after:w-full'
                                    }
                                `}
                            >
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/services"
                                className={({ isActive }) => `
                                    relative py-2 transition-all duration-300
                                    ${isActive
                                        ? 'text-[#1A73E8]'
                                        : 'hover:text-[#1A73E8]'
                                    }

                                    after:absolute
                                    after:left-0
                                    after:bottom-0
                                    after:h-[2px]
                                    after:bg-[#1A73E8]
                                    after:rounded-full
                                    after:transition-all
                                    after:duration-300

                                    ${isActive
                                        ? 'after:w-full'
                                        : 'after:w-0 hover:after:w-full'
                                    }
                                `}
                            >
                                Services
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/find-doctors"
                                className={({ isActive }) => `
                                    relative py-2 transition-all duration-300
                                    ${isActive
                                        ? 'text-[#1A73E8]'
                                        : 'hover:text-[#1A73E8]'
                                    }

                                    after:absolute
                                    after:left-0
                                    after:bottom-0
                                    after:h-[2px]
                                    after:bg-[#1A73E8]
                                    after:rounded-full
                                    after:transition-all
                                    after:duration-300

                                    ${isActive
                                        ? 'after:w-full'
                                        : 'after:w-0 hover:after:w-full'
                                    }
                                `}
                            >
                                Doctors
                            </NavLink>
                        </li>



                        <li>
                            <NavLink
                                to="/about"
                                className={({ isActive }) => `
                                    relative py-2 transition-all duration-300
                                    ${isActive
                                        ? 'text-[#1A73E8]'
                                        : 'hover:text-[#1A73E8]'
                                    }

                                    after:absolute
                                    after:left-0
                                    after:bottom-0
                                    after:h-[2px]
                                    after:bg-[#1A73E8]
                                    after:rounded-full
                                    after:transition-all
                                    after:duration-300

                                    ${isActive
                                        ? 'after:w-full'
                                        : 'after:w-0 hover:after:w-full'
                                    }
                                `}
                            >
                                About
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/contact"
                                className={({ isActive }) => `
                                    relative py-2 transition-all duration-300
                                    ${isActive
                                        ? 'text-[#1A73E8]'
                                        : 'hover:text-[#1A73E8]'
                                    }

                                    after:absolute
                                    after:left-0
                                    after:bottom-0
                                    after:h-[2px]
                                    after:bg-[#1A73E8]
                                    after:rounded-full
                                    after:transition-all
                                    after:duration-300

                                    ${isActive
                                        ? 'after:w-full'
                                        : 'after:w-0 hover:after:w-full'
                                    }
                                `}
                            >
                                Contact
                            </NavLink>
                        </li>

                    </ul>
                </div>


                {/* Desktop Appointment Button */}
                <div className='hidden lg:block'>
                    <div className="flex items-center gap-4">

                        {
                            loading ? (
                                <div className="flex justify-end items-center py-2">
                                    <div className="w-8 h-8 border-4 border-[#1A73E8] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) :

                                user ? (
                                    /* 2. Authenticated state: avatar and dropdown */
                                    <div className="relative" >
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-2 focus:outline-none cursor-pointer"
                                        >
                                            {/* Profile Photo or First Letter Avatar */}
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt="User Profile"
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-[#1A73E8]"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-lg uppercase shadow">
                                                    {user?.name ? user.name.charAt(0) : 'M'}
                                                </div>
                                            )}
                                        </button>

                                        {/* Dropdown Menu */}
                                        {dropdownOpen && (
                                            <div
                                                className="
            absolute
            right-0
            mt-3
            w-[260px]
            overflow-hidden
            rounded-2xl
            border
            border-[#E8EDF3]
            bg-white
            shadow-[0_12px_35px_rgba(15,35,60,0.12)]
            z-50
            animate-in
            fade-in
            slide-in-from-top-2
            duration-200
        "
                                            >

                                                {/* User Info */}
                                                <div className="px-4 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {/* Avatar */}
                                                        <div
                                                            className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        overflow-hidden
                        rounded-full
                        bg-[#EAF4FC]
                        text-[#1473EA]
                    "
                                                        >
                                                            {user?.photoURL ? (
                                                                <img
                                                                    src={user.photoURL}
                                                                    alt="Profile"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <User size={18} strokeWidth={1.7} />
                                                            )}
                                                        </div>


                                                        {/* Name + Email */}
                                                        <div className="min-w-0 flex-1">

                                                            <p className="truncate text-[14px] font-semibold text-[#0A1931]">
                                                                {user?.name || "User"}
                                                            </p>

                                                            <p className="mt-0.5 truncate text-[11px] text-[#7A8799]">
                                                                {user?.email || "user@example.com"}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* Role */}
                                                    <div className="mt-3">

                                                        <span
                                                            className="
                        inline-flex
                        items-center
                        rounded-full
                        bg-[#EFF6FF]
                        px-2.5
                        py-1
                        text-[10px]
                        font-semibold
                        capitalize
                        text-[#1473EA]
                    "
                                                        >
                                                            {user?.role || "Patient / User"}
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* Divider */}
                                                <div className="h-px bg-[#EEF1F5]" />


                                                {/* Dashboard */}
                                                <div className="p-2">

                                                    <Link
                                                        to={


                                                            "/dashboard"
                                                        }
                                                        onClick={() => setDropdownOpen(false)}
                                                        className="
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-[13px]
                    font-medium
                    text-[#344054]
                    transition-all
                    duration-200
                    hover:bg-[#F4F8FC]
                    hover:text-[#1473EA]
                "
                                                    >

                                                        <span
                                                            className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#F1F6FC]
                        text-[#1473EA]
                        transition
                        group-hover:bg-[#E5F0FC]
                    "
                                                        >
                                                            <LayoutDashboard
                                                                size={16}
                                                                strokeWidth={1.7}
                                                            />
                                                        </span>

                                                        <span className="flex-1">
                                                            Dashboard
                                                        </span>

                                                        <ChevronRight
                                                            size={15}
                                                            strokeWidth={1.7}
                                                            className="
                        text-[#AAB4C2]
                        transition-transform
                        duration-200
                        group-hover:translate-x-0.5
                        group-hover:text-[#1473EA]
                    "
                                                        />

                                                    </Link>

                                                </div>


                                                {/* Logout */}
                                                <div className="border-t border-[#EEF1F5] p-2">

                                                    <button
                                                        onClick={handleLogOut}
                                                        className="
                    group
                    flex
                    w-full
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-left
                    text-[13px]
                    font-medium
                    text-[#E5484D]
                    transition-all
                    duration-200
                    hover:bg-[#FFF4F4]
                "
                                                    >

                                                        <span
                                                            className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#FFF1F1]
                        text-[#E5484D]
                        transition
                        group-hover:bg-[#FFE5E5]
                    "
                                                        >
                                                            <LogOut
                                                                size={16}
                                                                strokeWidth={1.7}
                                                            />
                                                        </span>

                                                        <span className="flex-1">
                                                            Logout
                                                        </span>

                                                        <ChevronRight
                                                            size={15}
                                                            strokeWidth={1.7}
                                                            className="
                        text-[#F1A1A4]
                        transition-transform
                        duration-200
                        group-hover:translate-x-0.5
                    "
                                                        />

                                                    </button>

                                                </div>

                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* 3. Unauthenticated state: book appointment button */
                                    <Link
                                        to="/auth/login"
                                        className="
                        inline-block
                        text-center
                        bg-[#1A73E8]
                        text-white
                        font-semibold
                        px-6 py-3
                        rounded-full
                        cursor-pointer
                        transition-all duration-300
                        hover:bg-[#155FC0]
                        active:scale-95
                    "
                                    >
                                        Book Appointment
                                    </Link>
                                )}




                    </div>
                </div>


                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="
                        md:hidden
                        flex items-center justify-center
                        w-10 h-10
                        rounded-full
                        bg-white/80
                        border border-gray-200
                        text-[#1A73E8]
                        cursor-pointer
                        transition-all duration-300
                        active:scale-90
                    "
                >
                    {menuOpen ? (
                        <X size={22} />
                    ) : (
                        <Menu size={22} />
                    )}
                </button>

            </nav >


            {/* Mobile Menu */}
            < div
                className={`
                    md:hidden
                    bg-white/95
                    backdrop-blur-xl
                    border-t border-gray-100
                    overflow-hidden
                    transition-all duration-500 ease-in-out

                    ${menuOpen
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }
                `}
            >

                <div className='px-5 py-4'>

                    <ul className='flex flex-col gap-1'>

                        <li>
                            <NavLink
                                onClick={() => setMenuOpen(false)}
                                to="/"
                                className={({ isActive }) => `
                                    block px-4 py-3 rounded-xl
                                    font-semibold
                                    transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#EAF3FF] text-[#1A73E8] translate-x-1'
                                        : 'text-[#4A5568] hover:bg-gray-50 hover:text-[#1A73E8]'
                                    }
                                `}
                            >
                                Home
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                onClick={() => setMenuOpen(false)}
                                to="/services"
                                className={({ isActive }) => `
                                    block px-4 py-3 rounded-xl
                                    font-semibold
                                    transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#EAF3FF] text-[#1A73E8] translate-x-1'
                                        : 'text-[#4A5568] hover:bg-gray-50 hover:text-[#1A73E8]'
                                    }
                                `}
                            >
                                Services
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                onClick={() => setMenuOpen(false)}
                                to="/find-doctors"
                                className={({ isActive }) => `
                                    block px-4 py-3 rounded-xl
                                    font-semibold
                                    transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#EAF3FF] text-[#1A73E8] translate-x-1'
                                        : 'text-[#4A5568] hover:bg-gray-50 hover:text-[#1A73E8]'
                                    }
                                `}
                            >
                                Doctors
                            </NavLink>
                        </li>

                        {
                            user && (
                                <li>
                                    <NavLink
                                        onClick={() => setMenuOpen(false)}
                                        to="/dashboard"
                                        className={({ isActive }) => `
                                    block px-4 py-3 rounded-xl
                                    font-semibold
                                    transition-all duration-300
                                    ${isActive
                                                ? 'bg-[#EAF3FF] text-[#1A73E8] translate-x-1'
                                                : 'text-[#4A5568] hover:bg-gray-50 hover:text-[#1A73E8]'
                                            }
                                `}
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                            )
                        }




                        <li>
                            <NavLink
                                onClick={() => setMenuOpen(false)}
                                to="/about"
                                className={({ isActive }) => `
                                    block px-4 py-3 rounded-xl
                                    font-semibold
                                    transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#EAF3FF] text-[#1A73E8] translate-x-1'
                                        : 'text-[#4A5568] hover:bg-gray-50 hover:text-[#1A73E8]'
                                    }
                                `}
                            >
                                About
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                onClick={() => setMenuOpen(false)}
                                to="/contact"
                                className={({ isActive }) => `
                                    block px-4 py-3 rounded-xl
                                    font-semibold
                                    transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#EAF3FF] text-[#1A73E8] translate-x-1'
                                        : 'text-[#4A5568] hover:bg-gray-50 hover:text-[#1A73E8]'
                                    }
                                `}
                            >
                                Contact
                            </NavLink>
                        </li>

                    </ul>


                    {/* Mobile / Desktop Action Container */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="mt-3 flex items-center w-full gap-4 border-t border-gray-100 pt-3">
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        {user?.photoURL ? (
                                            <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full border-2 border-[#1A73E8] object-cover" />
                                        ) : (
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A73E8] text-lg font-bold uppercase text-white shadow">
                                                {user?.name?.charAt(0) || "U"}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-[#0A2B63]">{user?.name}</p>
                                            <p className="text-xs capitalize text-[#7890B0]">{user?.role || "patient"}</p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLogOut}
                                        title="Logout"
                                        className="flex cursor-pointer items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (

                            <Link
                                to="/auth/login"
                                className="
                inline-block
                text-center
                bg-[#1A73E8]
                text-white
                font-semibold
                px-6 py-3
                rounded-full
                cursor-pointer
                transition-all duration-300
                hover:bg-[#155FC0]
                active:scale-95
            "
                            >
                                Book Appointment
                            </Link>
                        )}
                    </div>

                </div>

            </div >

        </div >
    )
}

export default Navbar