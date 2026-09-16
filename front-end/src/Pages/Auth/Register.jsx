import React, { useRef, useState } from 'react'

import { User, Mail, LockKeyhole, Eye, EyeOff, Check, Camera, X, } from "lucide-react"; import SocialLogin from "./SocialLogin";
import { Link } from 'react-router';


const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [photo, setPhoto] = useState(null);
    const fileInputRef = useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0]; if (file) { setPhoto(URL.createObjectURL(file)); }
    };
    const removePhoto = () => {
        setPhoto(null); if (fileInputRef.current) { fileInputRef.current.value = ""; }
    };


    return (
        <div> <div className="rounded-xl bg-white p-6 shadow-[0_8px_30px_rgba(30,70,100,0.05)] sm:p-7">

            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl font-semibold text-[#0A1931]">
                    Create Account
                </h1>

                <p className="mt-1.5 text-[12px] text-[#4A5568]">
                    Create your account to get started with better healthcare
                </p>
            </div>


            {/* User Photo */}
            <div className="mb-4">
                <label className="mb-1.5 block text-[14px] font-medium text-[#0A1931]">
                    Profile Photo
                    <span className="ml-1 text-[11px] font-normal text-[#9BA6B7]">
                        (Optional)
                    </span>
                </label>

                <div className="flex items-center gap-3">

                    {/* Preview */}
                    <div className="relative shrink-0">
                        <div
                            className="
                flex
                h-[52px]
                w-[52px]
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-[#DCE2EB]
                bg-[#F5F8FC]
              "
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt="Profile preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User
                                    size={21}
                                    strokeWidth={1.5}
                                    className="text-[#9BA6B7]"
                                />
                            )}
                        </div>

                        {/* Remove */}
                        {photo && (
                            <button
                                type="button"
                                onClick={removePhoto}
                                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-[18px]
                  w-[18px]
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white
                  bg-[#4A5568]
                  text-white
                  transition
                  hover:bg-[#0A1931]
                "
                            >
                                <X size={10} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>

                    {/* Upload */}
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="
                flex
                h-[32px]
                items-center
                gap-1.5
                rounded-md
                border
                border-[#DCE2EB]
                bg-white
                px-3
                text-[12px]
                font-medium
                text-[#4A5568]
                transition
                hover:border-[#1473EA]
                hover:text-[#1473EA]
              "
                        >
                            <Camera size={14} strokeWidth={1.7} />
                            {photo ? "Change Photo" : "Upload Photo"}
                        </button>

                        <p className="mt-1 text-[10px] text-[#9BA6B7]">
                            JPG, PNG or WEBP · Max 5MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Full Name */}
            <div className="mb-4">
                <label className="mb-1.5 block text-[14px] font-medium text-[#0A1931]">
                    Full Name
                </label>

                <div className="relative">
                    <User
                        size={14}
                        strokeWidth={1.5}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA6B7]"
                    />

                    <input
                        type="text"
                        placeholder="Enter your full name"
                        className="
              h-[38px]
              w-full
              rounded-md
              border
              border-[#DCE2EB]
              bg-white
              pl-9
              pr-3
              text-[13px]
              text-[#333]
              outline-none
              placeholder:text-[#4A5568]
              focus:border-[#1473EA]
              focus:ring-1
              focus:ring-[#1473EA]/20
            "
                    />
                </div>
            </div>



            {/* Email */}
            <div className="mb-4">
                <label className="mb-1.5 block text-[14px] font-medium text-[#0A1931]">
                    Email Address
                </label>

                <div className="relative">
                    <Mail
                        size={14}
                        strokeWidth={1.5}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA6B7]"
                    />

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="
              h-[38px]
              w-full
              rounded-md
              border
              border-[#DCE2EB]
              bg-white
              pl-9
              pr-3
              text-[13px]
              text-[#333]
              outline-none
              placeholder:text-[#4A5568]
              focus:border-[#1473EA]
              focus:ring-1
              focus:ring-[#1473EA]/20
            "
                    />
                </div>
            </div>

            {/* Password */}
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

            {/* Terms */}
            <div className="mb-4 flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => setAgree(!agree)}
                    className={`
            flex
            h-[13px]
            w-[13px]
            shrink-0
            items-center
            justify-center
            rounded-[3px]
            border
            transition
            ${agree
                            ? "border-[#1473EA] bg-[#1473EA]"
                            : "border-[#D5DCE6] bg-white"
                        }
          `}
                >
                    {agree && (
                        <Check
                            size={9}
                            strokeWidth={3}
                            className="text-white"
                        />
                    )}
                </button>

                <span className="text-[12px] text-[#778398]">
                    I agree to the{" "}
                    <a
                        href="/terms"
                        className="font-medium text-[#1473EA] hover:underline"
                    >
                        Terms & Conditions
                    </a>
                </span>
            </div>

            {/* Create Account */}
            <button
                type="submit"
                className="
          h-[38px]
          w-full
          rounded-md
          bg-[#1473EA]
          text-[14px]
          font-medium
          text-white
          shadow-sm
          transition
          hover:bg-[#0968DC]
        "
            >
                Create Account
            </button>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#EDF0F4]" />

                <span className="whitespace-nowrap text-[12px] text-[#4A5568]">
                    or continue with
                </span>

                <div className="h-px flex-1 bg-[#EDF0F4]" />
            </div>

            {/* Social */}
            <div className="w-full">
                <SocialLogin />
            </div>

            {/* Sign In */}
            <p className="mt-5 text-center text-[12px] text-[#4A5568]">
                Already have an account?

                <Link
                    to="/auth/login"
                    className="ml-1 font-medium text-[#0066FE] hover:underline"
                >
                    Sign In
                </Link>
            </p>
        </div>
        </div>
    )
}

export default Register