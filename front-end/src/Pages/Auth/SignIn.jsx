import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Check,
  Apple,
} from "lucide-react";
import SocialLogin from "./SocialLogin";
import { Link } from "react-router";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className=" rounded-xl bg-white p-6 shadow-[0_8px_30px_rgba(30,70,100,0.05)] sm:p-7">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-[#0A1931]">
          Sign In
        </h1>

        <p className="mt-1.5 text-[12px] text-[#4A5568]">
          Welcome back! Please sign in to your account
        </p>
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
      <div className="mb-3">

        <div className="mb-1.5 flex items-center justify-between">

          <label className="text-[14px] font-medium text-[#0A1931]">
            Password
          </label>

          <Link
            to="/Forgot-password"
            className="text-[12px] font-medium text-[#1473EA] hover:underline"
          >
            Forgot?
          </Link>

        </div>


        <div className="relative">

          <LockKeyhole
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA6B7]"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>

        </div>

      </div>


      {/* Remember */}
      <div className="mb-4 flex items-center gap-1.5">

        <button
          type="button"
          onClick={() => setRemember(!remember)}
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
            ${remember
              ? "border-[#1473EA] bg-[#1473EA]"
              : "border-[#D5DCE6] bg-white"
            }
          `}
        >
          {remember && (
            <Check
              size={9}
              strokeWidth={3}
              className="text-white"
            />
          )}
        </button>

        <span className="text-[12px] text-[#778398]">
          Remember me
        </span>

      </div>


      {/* Sign In */}
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
        Sign In
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
      <div className=" w-ful">

        <SocialLogin />
      </div>


      {/* Sign Up */}
      <p className="mt-5 text-center text-[12px] text-[#4A5568]">

        Don't have an account?

        <Link
          to="/auth/register"
          className="ml-1 font-medium text-[#0066FE] hover:underline"
        >
          Sign Up
        </Link>

      </p>

    </div>
  );
};

export default SignIn;