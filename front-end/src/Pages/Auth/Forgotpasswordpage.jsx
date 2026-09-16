import React from 'react'

import { Mail, Lock, ArrowLeft } from "lucide-react";

const Forgotpasswordpage = () => {
    return (
        <div>
            <div className="flex min-h-screen w-full ">
                <div className="grid w-full  grid-cols-1  overflow-hidden  bg-white shadow-sm shadow-slate-900/5 sm:grid-cols-2">
                    {/* Brand / illustration side */}
                    <div className="relative flex flex-col items-center justify-center bg-[#f8fbfe] p-8 text-center">
                        <div className="absolute left-8 top-8">
                            {/* Logo */}
                            <div className='flex items-center mb-8 gap-1'>
                                <img
                                    className="h-9 w-9"
                                    src="/public/logo-icon-bg.svg"
                                    alt="Logo"
                                />

                                <h1 className="text-xl font-bold">
                                    Medicare
                                </h1>
                            </div>
                        </div>


                        <div className="relative  flex h-48 w-48 items-center justify-center">
                            <svg
                                width="220"
                                height="220"
                                viewBox="0 0 220 220"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >

                                <circle
                                    cx="110"
                                    cy="110"
                                    r="82"
                                    fill=""
                                />


                                <path
                                    d="M151 35V49M144 42H158"
                                    stroke="#B9D9FF"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                />

                                <path
                                    d="M181 83V97M174 90H188"
                                    stroke="#D3E7FF"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                />


                                <path
                                    d="M55 94
       C65 84 74 77 87 73
       C99 69 112 72 116 80
       C121 91 113 101 106 96
       C100 92 102 83 108 77"
                                    stroke="#B7D8FF"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                    stroke-dasharray="5 7"
                                />


                                <path
                                    d="M54 94L61 93L57 87"
                                    stroke="#B7D8FF"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />


                                <rect
                                    x="48"
                                    y="106"
                                    width="108"
                                    height="78"
                                    rx="10"
                                    fill="#DDEEFF"
                                    opacity="0.45"
                                />


                                <rect
                                    x="48"
                                    y="103"
                                    width="108"
                                    height="78"
                                    rx="10"
                                    fill="#F8FCFF"
                                    stroke="#BBD9F7"
                                    stroke-width="2"
                                />


                                <path
                                    d="M50 110L96 146C99 148.5 103 148.5 106 146L154 110"
                                    fill="#E8F4FF"
                                    stroke="#BBD9F7"
                                    stroke-width="2"
                                    stroke-linejoin="round"
                                />


                                <path
                                    d="M50 109L94 142
       C99 146 103 146 108 142
       L154 109"
                                    fill="white"
                                    stroke="#C8E1FA"
                                    stroke-width="2"
                                    stroke-linejoin="round"
                                />


                                <circle
                                    cx="149"
                                    cy="164"
                                    r="36"
                                    fill="#1479F5"
                                />


                                <path
                                    d="M139 160V151
       C139 145.5 143.5 141 149 141
       C154.5 141 159 145.5 159 151
       V160"
                                    stroke="white"
                                    stroke-width="5"
                                    stroke-linecap="round"
                                />


                                <rect
                                    x="135"
                                    y="157"
                                    width="28"
                                    height="24"
                                    rx="4"
                                    fill="white"
                                />


                                <circle
                                    cx="149"
                                    cy="166"
                                    r="3"
                                    fill="#1479F5"
                                />

                                <path
                                    d="M149 169V174"
                                    stroke="#1479F5"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </div>

                        <p className="mt-8 text-sm font-semibold text-slate-900">
                            We've got you covered!
                        </p>
                        <p className="mt-1 max-w-[200px] text-xs text-slate-500">
                            Reset your password and get back to managing your health.
                        </p>
                    </div>

                    {/* Form side */}
                    <div className='w-full flex justify-center items-center   max-w-[470px] mx-auto'>

                        <div className="flex items-center p-8 sm:p-10">
                            <div className="w-full">
                                <h1 className="text-xl font-bold text-[#0A1931]">
                                    Forgot Password?
                                </h1>
                                <p className="mt-1 text-sm text-[#4A5568]">
                                    No worries! Enter your email and we'll send you a link to
                                    reset your password.
                                </p>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[#4A5568]">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail
                                                size={15}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400"
                                            />
                                        </div>
                                    </div>

                                    <button className="w-full rounded-lg bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                                        Send Reset Link
                                    </button>

                                    <div className="flex items-center gap-3 text-xs text-[#4A5568]">
                                        <span className="h-px flex-1 bg-slate-200" />
                                        or
                                        <span className="h-px flex-1 bg-slate-200" />
                                    </div>

                                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-[#0066FE] hover:bg-slate-50 transition-colors">
                                        <ArrowLeft size={14} />
                                        Back to Sign In
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forgotpasswordpage