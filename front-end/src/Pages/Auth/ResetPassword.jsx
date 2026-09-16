import React, { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, ArrowLeft } from "lucide-react";

const ResetPassword = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
                            <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">


                                <circle cx="82" cy="91" r="48" fill="#F5FAFF" />


                                <path
                                    d="M38 55V62M34.5 58.5H41.5"
                                    stroke="#B8D9FF"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                />

                                <path
                                    d="M128 47V55M124 51H132"
                                    stroke="#A9D2FF"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                />

                                <path
                                    d="M137 76V83M133.5 79.5H140.5"
                                    stroke="#B8D9FF"
                                    stroke-width="2.5"
                                    stroke-linecap="round"
                                />


                                <circle cx="31" cy="82" r="2" fill="#CFE6FF" />
                                <circle cx="145" cy="62" r="2" fill="#D5EAFF" />


                                <path
                                    d="M61 84V67
       C61 55 69 47 80 47
       C91 47 99 55 99 67V84"
                                    stroke="#1479F5"
                                    stroke-width="7"
                                    stroke-linecap="round"
                                />


                                <path
                                    d="M66 79V67C66 58 72 52 80 52"
                                    stroke="#8EC4FF"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                    opacity="0.8"
                                />


                                <rect
                                    x="51"
                                    y="78"
                                    width="58"
                                    height="48"
                                    rx="7"
                                    fill="#1479F5"
                                />


                                <path
                                    d="M56 84C56 81 58 80 61 80H101"
                                    stroke="#3994FF"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                />


                                <circle
                                    cx="80"
                                    cy="99"
                                    r="6"
                                    fill="white"
                                />

                                <path
                                    d="M80 103V114"
                                    stroke="white"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                />


                                <circle
                                    cx="108"
                                    cy="119"
                                    r="20"
                                    fill="#1479F5"
                                />

                                <circle
                                    cx="108"
                                    cy="119"
                                    r="16"
                                    fill="#1479F5"
                                    stroke="#EAF4FF"
                                    stroke-width="2"
                                />


                                <path
                                    d="M100 119L106 125L117 113"
                                    stroke="white"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />


                                <ellipse
                                    cx="80"
                                    cy="132"
                                    rx="43"
                                    ry="5"
                                    fill="#DDEEFF"
                                    opacity="0.6"
                                />

                            </svg>
                        </div>

                        <p className="mt-8 text-sm font-semibold text-slate-900">
                            Almost Done!
                        </p>
                        <p className="mt-1 max-w-[200px] text-xs text-slate-500">
                            Your new pacsword must be
                            ditferent from previous passwords.
                        </p>
                    </div>

                    {/* Form side */}
                    <div className='w-full flex justify-center items-center   max-w-[470px] mx-auto'>

                        <div className="flex items-center p-8 w-full sm:p-10">
                            <div className="w-full">
                                <h1 className="text-xl font-bold text-[#0A1931]">
                                    Reset Password
                                </h1>
                                <p className="mt-1 text-sm text-[#4A5568]">
                                    Create a new password for your account
                                </p>

                                <div className="mt-6 relative space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[#4A5568]">
                                            New Password
                                        </label>
                                        <div className="mb-4">
                                            <label className="mb-1.5 block text-[14px] font-medium text-[#0A1931]">
                                                Password
                                            </label>

                                            <div className="relative">
                                                <LockKeyhole
                                                    size={14}
                                                    strokeWidth={1.5}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA6B7]"
                                                />

                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Create a password"
                                                    className="
              h-[38px]
              w-full
              rounded-md
              border
              border-[#DCE2EB]
              bg-white
              pl-9
              pr-10
              text-[13px]
              text-[#4A5568]
              outline-none
              placeholder:text-[#4A5568]
              focus:border-[#1473EA]
              focus:ring-1
              focus:ring-[#1473EA]/20
            "
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-[#9BA6B7]
              transition
              hover:text-[#526174]
            "
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="mb-3">
                                            <label className="mb-1.5 block text-[14px] font-medium text-[#0A1931]">
                                                Confirm Password
                                            </label>

                                            <div className="relative">
                                                <LockKeyhole
                                                    size={14}
                                                    strokeWidth={1.5}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA6B7]"
                                                />

                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm your password"
                                                    className="
              h-[38px]
              w-full
              rounded-md
              border
              border-[#DCE2EB]
              bg-white
              pl-9
              pr-10
              text-[13px]
              text-[#4A5568]
              outline-none
              placeholder:text-[#4A5568]
              focus:border-[#1473EA]
              focus:ring-1
              focus:ring-[#1473EA]/20
            "
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                    className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-[#9BA6B7]
              transition
              hover:text-[#526174]
            "
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff size={16} />
                                                    ) : (
                                                        <Eye size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full rounded-lg bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                                        Reset Pastword
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

export default ResetPassword