import { useState } from "react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Check,
  Loader2
} from "lucide-react";

import { useForm } from "react-hook-form";
import SocialLogin from "./SocialLogin";
import { Link, useLocation, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // -----------------------------
  // Submit
  // -----------------------------
  const onSubmit = async (data) => {
    const loginData = {
      email: data.email,
      password: data.password,
      remember,
    };
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/login', loginData);
      // Handle the successful login response.
      login(res.data.accessToken, res.data.user);
      // console.log(res)
      if (res.data.message) {
        toast.success(
          res.data.message ||
          "Login successful! Welcome back.!"
        );
      }
      navigate(location.state?.from || "/");
    } catch (err) {
      // console.log(err)
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
    // console.log("Login Data:", loginData);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-[0_8px_30px_rgba(30,70,100,0.05)] sm:p-7">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-[#0A1931]">
          Sign In
        </h1>

        <p className="mt-1.5 text-[12px] text-[#4A5568]">
          Welcome back! Please sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

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
              {...register("email", {
                required: "Email address is required",
                pattern: {
                  value:
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Enter a valid email address",
                },
              })}
              className={`
                h-[38px]
                w-full
                rounded-md
                border
                bg-white
                pl-9
                pr-3
                text-[13px]
                text-[#333]
                outline-none
                placeholder:text-[#4A5568]
                focus:ring-1
                ${errors.email
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                  : "border-[#DCE2EB] focus:border-[#1473EA] focus:ring-[#1473EA]/20"
                }
              `}
            />

          </div>

          {errors.email && (
            <p className="mt-1 text-[11px] text-red-500">
              {errors.email.message}
            </p>
          )}

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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={`
                h-[38px]
                w-full
                rounded-md
                border
                bg-white
                pl-9
                pr-10
                text-[13px]
                text-[#4A5568]
                outline-none
                placeholder:text-[#4A5568]
                focus:ring-1
                ${errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                  : "border-[#DCE2EB] focus:border-[#1473EA] focus:ring-[#1473EA]/20"
                }
              `}
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

          {errors.password && (
            <p className="mt-1 text-[11px] text-red-500">
              {errors.password.message}
            </p>
          )}

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
          disabled={loading}
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
        disabled:opacity-70
        disabled:cursor-not-allowed
        flex
        items-center
        justify-center
        gap-2
    "
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>

      </form>

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









