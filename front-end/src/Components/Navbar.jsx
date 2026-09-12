import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showNavbar, setShowNavbar] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

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
                <div className='flex items-center gap-1'>
                    <img
                        className="h-9 w-9"
                        src="/public/logo-icon-bg.svg"
                        alt="Logo"
                    />

                    <h1 className="text-xl font-bold">
                        Medicare
                    </h1>
                </div>


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
                                Blog
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
                    <button
                        className="
                            bg-[#1A73E8]
                            text-white font-semibold
                            px-4 py-2.5
                            cursor-pointer
                            rounded-full
                            transition-all duration-300
                            hover:bg-[#155FC0]
                            hover:-translate-y-0.5
                            hover:shadow-lg
                            hover:shadow-blue-200
                            active:scale-95
                        "
                    >
                        Book Appointment
                    </button>
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

            </nav>


            {/* Mobile Menu */}
            <div
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
                                Blog
                            </NavLink>
                        </li>

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


                    {/* Mobile Appointment */}
                    <button
                        className="
                            w-full
                            mt-4
                            bg-[#1A73E8]
                            text-white
                            font-semibold
                            py-3
                            rounded-full
                            cursor-pointer
                            transition-all duration-300
                            hover:bg-[#155FC0]
                            active:scale-95
                        "
                    >
                        Book Appointment
                    </button>

                </div>

            </div>

        </div>
    )
}

export default Navbar