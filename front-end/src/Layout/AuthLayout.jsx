import { CalendarDays, PhoneCall, ShieldCheck, UserRound } from 'lucide-react';
import React from 'react';
import hero from '../assets/heropic.png'
import doctor from '../assets/svg-icon/doctor.svg'

import { Outlet } from 'react-router';


const AuthLayout = () => {




    return (

        <>
            <div>
                <div className="flex min-h-screen w-full ">
                    <div className="grid w-full  grid-cols-1  overflow-hidden  bg-white  sm:grid-cols-2">
                        {/* Brand / illustration side */}
                        <div className="relative hidden md:block flex flex-col  justify-center  bg-gradient-to-br
            from-[#F8FBFE]
             via-[#EAF4FC]
            to-[#DCEEFF] p-14">
                            <div className="absolute left-14 top-10">
                                {/* Logo */}
                                <div className='flex items-center mb-8 gap-1'>
                                    <img
                                        className="h-9 w-9"
                                        src="/logo-icon-bg.svg"
                                        alt="Logo"
                                    />

                                    <h1 className="text-xl font-bold">
                                        Medicare
                                    </h1>
                                </div>
                            </div>


                            <div className='flex hidden md:block items-center relative max-w-[570px] md:mt '>
                                <div>
                                    <h1 className='text-xl md:mt-8 text-left font-bold text-[#4A5568]'>Welcome Back!</h1>
                                    <h2 className='text-3xl text-left mt-3 font-bold text-[#0A1931]'> Take the First Step
                                        Toward <br />
                                        {""} <span className='text-[#0066FE]'>better health </span></h2>
                                    <p className='text-[#4A5568] text-sm mt-3 text-left'>Access your personalized healthcare dashboard <br />
                                        and book appointments with trusted doctors.</p>

                                    <div className=" left-8 pt-8 space-y-4">

                                        {/* Appointment */}
                                        <div className="flex items-center gap-2.5">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#E3F0FF]">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="5" width="16" height="15" rx="3"
                                                        stroke="#1479F5" stroke-width="1.7" />
                                                    <path d="M8 3V7M16 3V7M4 9H20"
                                                        stroke="#1479F5" stroke-width="1.7"
                                                        stroke-linecap="round" />
                                                    <path d="M12 16.8C12 16.8 8.8 14.9 8.8 12.9C8.8 12 9.5 11.3 10.4 11.3C11.1 11.3 11.7 11.7 12 12.2C12.3 11.7 12.9 11.3 13.6 11.3C14.5 11.3 15.2 12 15.2 12.9C15.2 14.9 12 16.8 12 16.8Z"
                                                        stroke="#1479F5" stroke-width="1.3"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>

                                            <div>
                                                <p className="text-[12px] font-semibold text-[#0A1931]">
                                                    Book Appointments
                                                </p>

                                                <p className="text-[9px] text-[#4A5568]">
                                                    Schedule visits with top specialists
                                                </p>
                                            </div>

                                        </div>


                                        {/* Secure */}
                                        <div className="flex items-center gap-2.5">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#E3F0FF]">
                                                <ShieldCheck
                                                    size={18}
                                                    className="text-[#1473EA]"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[12px] font-semibold text-[#0A1931]">
                                                    Secure & Private
                                                </p>

                                                <p className="text-[9px] text-[#4A5568]">
                                                    Your health data is safe with us
                                                </p>
                                            </div>

                                        </div>


                                        {/* Personalized */}
                                        <div className="flex items-center gap-2.5">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#E3F0FF]">
                                                <UserRound
                                                    size={18}
                                                    className="text-[#1473EA]"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[12px] font-semibold text-[#0A1931]">
                                                    Personalized Care
                                                </p>

                                                <p className="text-[9px] text-[#4A5568]">
                                                    Get recommendations for you
                                                </p>
                                            </div>

                                        </div>


                                        {/* Support */}
                                        <div className="flex items-center gap-2.5">

                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#E3F0FF]">
                                                <PhoneCall
                                                    size={18}
                                                    className="text-[#1473EA]"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[12px] font-semibold text-[#0A1931]">
                                                    24/7 Support
                                                </p>

                                                <p className="text-[9px] text-[#4A5568]">
                                                    We're here for you anytime
                                                </p>
                                            </div>

                                        </div>

                                    </div>


                                </div>

                                <div className=' md:hidden lg:block  -bottom-20 right-0 absolute'>
                                    <div
                                        className="
                  relative
            w-full
            max-w-[520px]
            h-[350px]

            lg:h-[320px]
            grid
            grid-cols-1
            grid-rows-1

            shrink-0
                "
                                    >

                                        {/* ================= SVG BACKGROUND ================= */}
                                        <svg
                                            viewBox="0 0 620 620"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="
                    col-start-1
                    row-start-1
                    h-full
                    w-full
                  "
                                        >
                                            <defs>
                                                <radialGradient
                                                    id="heroBg"
                                                    cx="0"
                                                    cy="0"
                                                    r="1"
                                                    gradientUnits="userSpaceOnUse"
                                                    gradientTransform="translate(310 270) rotate(90) scale(300)"
                                                >
                                                    <stop
                                                        offset="0"
                                                        stopColor="#E8F4FF"
                                                    />

                                                    <stop
                                                        offset="0.7"
                                                        stopColor="#F1F8FF"
                                                    />

                                                    <stop
                                                        offset="1"
                                                        stopColor="#F8FBFF"
                                                    />
                                                </radialGradient>
                                            </defs>

                                            <rect
                                                width="620"
                                                height="620"
                                                rx="32"
                                                fill="none"
                                            />

                                            <circle
                                                cx="310"
                                                cy="280"
                                                r="245"
                                                fill="#E1EFFE"
                                                opacity="1"
                                            />

                                            <circle
                                                cx="310"
                                                cy="280"
                                                r="205"
                                                fill="#E1EFFE"
                                                opacity="1"
                                            />

                                            <path
                                                d="M20 330 H85 L105 330 L132 285 L158 375 L195 220 L235 350 L270 305 L300 330 H370"
                                                stroke="#7BB8FF"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                opacity="0.8"
                                            />
                                        </svg>

                                        {/* ================= HERO IMAGE AREA ================= */}
                                        <div
                                            className="
                    col-start-1
                    row-start-1
                    z-10
                    flex
                    items-end
                    justify-center
                    relative
                  "
                                        >

                                            {/* ================= MAIN IMAGE ================= */}
                                            <div

                                                className="inline-block"
                                            >
                                                <img
                                                    src={hero}

                                                    alt="Hero Image"
                                                    className="

          h-[370px]

          md:h-[280px]
          lg:h-[380px]
          w-auto
          max-w-[95%]


          object-contain
        "
                                                />
                                            </div>



                                        </div>

                                    </div>
                                </div>
                                <div className='bg-white  md:hidden lg:block rounded-2xl z-10 top-28 w-12 h-12 absolute right-0'>
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="23"
                                            fill="" />
                                        <rect x="18" y="11" width="12" height="26" rx="3"
                                            fill="#1479F5" />
                                        <rect x="11" y="18" width="26" height="12" rx="3"
                                            fill="#1479F5" />
                                    </svg>
                                </div>
                            </div>


                        </div>

                        {/* Form side */}
                        <div className='w-full flex justify-center items-center   max-w-[470px] mx-auto'>

                            <div className="w-full  max-w-[470px] mx-auto">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>




    );
};

export default AuthLayout;