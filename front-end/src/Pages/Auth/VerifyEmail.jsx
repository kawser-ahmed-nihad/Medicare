import React, { useRef, useState } from 'react'

const VerifyEmail = () => {

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (paste.length === 6) {
            setOtp(paste.split(""));
            inputRefs.current[5].focus();
        }
    };


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


                                <circle cx="90" cy="88" r="55" fill="#F7FBFF" />
                                <circle cx="90" cy="88" r="53" stroke="#DCEEFF" />


                                <ellipse cx="90" cy="137" rx="43" ry="5" fill="#DDEEFF" opacity="0.65" />


                                <path
                                    d="M90 40
       C80 47 69 51 57 54
       V81
       C57 105 70 123 90 133
       C110 123 123 105 123 81
       V54
       C111 51 100 47 90 40Z"
                                    fill="#EAF4FF"
                                    stroke="#C7E2FF"
                                    stroke-width="2"
                                />


                                <path
                                    d="M90 48
       C81 54 72 57 65 59
       V81
       C65 99 75 113 90 121
       C105 113 115 99 115 81
       V59
       C108 57 99 54 90 48Z"
                                    fill="#DCEEFF"
                                />


                                <path
                                    d="M69 84L83 98L111 68"
                                    stroke="#1479F5"
                                    stroke-width="8"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />


                                <path
                                    d="M64 61C74 58 82 54 90 48"
                                    stroke="white"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                    opacity="0.9"
                                />

                            </svg>
                        </div>

                        <p className="mt-8 text-sm font-semibold text-slate-900">
                            Verify to Secure
                        </p>
                        <p className="mt-1 max-w-[200px] text-xs text-slate-500">
                            We send verification codes to
                            keep your account secure.
                        </p>
                    </div>

                    {/* Form side */}
                    <div className='w-full flex justify-center items-center   max-w-[470px] mx-auto'>

                        <div className="flex items-center p-8 sm:p-10">
                            <div className="w-full">
                                <h1 className="text-xl font-bold text-[#0A1931]">
                                    Verify Your Email
                                </h1>
                                <p className="mt-1 text-sm text-[#4A5568]">
                                    Enter the 6-digit code sent to
                                </p>
                                <p className="mt-1 text-sm text-[#0A1931]">
                                    nihad.kawser@gmail.com
                                </p>

                                <div className="mt-6 relative space-y-4">


                                    <div className="flex justify-center gap-3 mb-6">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                className="w-12 h-12 text-center mt-2 border-b border-gray-200 focus:border-[#ffb84b] focus:border-b outline-none px-3 py-3"
                                            />
                                        ))}
                                    </div>

                                    <button className="w-full rounded-lg bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                                        Verify & Continue
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

export default VerifyEmail