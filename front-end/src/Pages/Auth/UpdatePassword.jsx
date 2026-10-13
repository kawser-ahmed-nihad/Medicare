import React, { useEffect, useState } from "react";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Check,
    X,
    Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxios from "../../hooks/useAxios";
import { useSearchParams } from "react-router";

// Password rule component
const PasswordRule = ({ valid, text }) => (
    <div className="flex items-center gap-1.5 text-[11px]">
        {valid ? (
            <Check size={12} className="text-green-500" />
        ) : (
            <X size={12} className="text-slate-400" />
        )}
        <span className={valid ? "text-slate-700" : "text-slate-400"}>
            {text}
        </span>
    </div>
);

const UpdatePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // useSearchParams is a hook that returns a tuple; read the query parameter from its first item.
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    // Track token validity and loading state before displaying the form.
    const [loading, setLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [doctorName, setDoctorName] = useState("");

    const axiosInstance = useAxios(); // Public instance; no auth token is available before login.

    // 1. Verify token on initial render
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                toast.error("Invalid or missing token!");
                setLoading(false);
                return;
            }

            try {
                // GET, not POST — matches router.get("/verify-invite", verifyInviteToken)
                const res = await axiosInstance.get("/api/auth/verify-invite", {
                    params: { token },
                });
                if (res.data?.success) {
                    setIsValidToken(true);
                    setDoctorName(res.data.doctor_name || "");
                }
            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.message || "Token is invalid or has expired.");
                setIsValidToken(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch("newPassword", "");

    // Password strength
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const passwordStrength =
        Object.values(passwordChecks).filter(Boolean).length;

    const onSubmit = async (data) => {
        try {
            // Use POST with the correct path and the body shape expected by the backend: { token, password }.
            const res = await axiosInstance.post(
                "/api/auth/set-password",
                {
                    token,
                    password: data.newPassword,
                },
                { withCredentials: true } // so the refresh-token cookie gets set
            );

            toast.success(
                res.data?.message || "Password set successfully. You're now logged in."
            );

            reset();

            if (res.data?.accessToken) {
                // store the access token however the rest of your app expects it
                // e.g. localStorage / auth context / redirect to dashboard
                // localStorage.setItem("accessToken", res.data.accessToken);
                // navigate("/doctor/dashboard");
            }
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to update password."
            );
        }
    };

    // ---- gate the form on token status ----

    if (loading) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fbfe]">
                <Loader2 className="h-6 w-6 animate-spin text-[#1473EA]" />
            </div>
        );
    }

    if (!token || !isValidToken) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fbfe] px-4">
                <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-lg font-bold text-[#0A1931]">Link invalid or expired</h1>
                    <p className="mt-2 text-sm text-[#4A5568]">
                        This password-setup link is no longer valid. Please ask the clinic admin to resend your invite.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full">
            <div className="grid w-full grid-cols-1 overflow-hidden bg-white shadow-sm shadow-slate-900/5 sm:grid-cols-2">

                {/* Left Side */}
                <div className="relative flex flex-col items-center justify-center bg-[#f8fbfe] p-8 text-center">
                    <div className="absolute left-8 top-8">
                        <div className="mb-8 flex items-center gap-1">
                            <img className="h-9 w-9" src="/logo-icon-bg.svg" alt="Logo" />
                            <h1 className="text-xl font-bold">Medicare</h1>
                        </div>
                    </div>

                    <div className="relative flex h-48 w-48 items-center justify-center">
                        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="82" cy="91" r="48" fill="#F5FAFF" />
                            <path d="M38 55V62M34.5 58.5H41.5" stroke="#B8D9FF" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M128 47V55M124 51H132" stroke="#A9D2FF" strokeWidth="3" strokeLinecap="round" />
                            <path d="M137 76V83M133.5 79.5H140.5" stroke="#B8D9FF" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="31" cy="82" r="2" fill="#CFE6FF" />
                            <circle cx="145" cy="62" r="2" fill="#D5EAFF" />
                            <path d="M61 84V67C61 55 69 47 80 47C91 47 99 55 99 67V84" stroke="#1479F5" strokeWidth="7" strokeLinecap="round" />
                            <path d="M66 79V67C66 58 72 52 80 52" stroke="#8EC4FF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                            <rect x="51" y="78" width="58" height="48" rx="7" fill="#1479F5" />
                            <path d="M56 84C56 81 58 80 61 80H101" stroke="#3994FF" strokeWidth="3" strokeLinecap="round" />
                            <circle cx="80" cy="99" r="6" fill="white" />
                            <path d="M80 103V114" stroke="white" strokeWidth="4" strokeLinecap="round" />
                            <circle cx="108" cy="119" r="20" fill="#1479F5" />
                            <circle cx="108" cy="119" r="16" fill="#1479F5" stroke="#EAF4FF" strokeWidth="2" />
                            <path d="M100 119L106 125L117 113" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <ellipse cx="80" cy="132" rx="43" ry="5" fill="#DDEEFF" opacity="0.6" />
                        </svg>
                    </div>

                    <p className="mt-8 text-sm font-semibold text-slate-900">Keep Your Account Secure</p>
                    <p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-500">
                        Use a strong password that is different from your previous password.
                    </p>
                </div>

                {/* Right Side */}
                <div className="mx-auto flex w-full max-w-[470px] items-center justify-center">
                    <div className="flex w-full items-center p-8 sm:p-10">
                        <div className="w-full">
                            <h1 className="text-xl font-bold text-[#0A1931]">Set Your Password</h1>
                            <p className="mt-1 text-sm text-[#4A5568]">
                                {doctorName ? `Welcome, ${doctorName}. ` : ""}Choose a password to activate your account.
                            </p>

                            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                                {/* New Password */}
                                <div className="mb-4">
                                    <label className="mb-1.5 block text-[14px] font-medium text-[#0A1931]">
                                        New Password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={14}
                                            strokeWidth={1.5}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA6B7]"
                                        />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a new password"
                                            {...register("newPassword", {
                                                required: "New password is required",
                                                minLength: { value: 8, message: "Password must be at least 8 characters" },
                                                validate: {
                                                    uppercase: (v) => /[A-Z]/.test(v) || "Password needs an uppercase letter",
                                                    lowercase: (v) => /[a-z]/.test(v) || "Password needs a lowercase letter",
                                                    number: (v) => /[0-9]/.test(v) || "Password needs a number",
                                                    special: (v) => /[^A-Za-z0-9]/.test(v) || "Password needs a special character",
                                                },
                                            })}
                                            className={`h-[38px] w-full rounded-md border bg-white pl-9 pr-10 text-[13px] text-[#4A5568] outline-none placeholder:text-[#4A5568] focus:ring-1 ${errors.newPassword
                                                ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                                : "border-[#DCE2EB] focus:border-[#1473EA] focus:ring-[#1473EA]/20"
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA6B7] hover:text-[#526174]"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {password && (
                                        <div className="mt-2">
                                            <div className="mb-1.5 flex gap-1">
                                                {[1, 2, 3, 4, 5].map((item) => (
                                                    <div
                                                        key={item}
                                                        className={`h-[3px] flex-1 rounded-full transition ${item <= passwordStrength
                                                            ? passwordStrength <= 2
                                                                ? "bg-red-400"
                                                                : passwordStrength <= 3
                                                                    ? "bg-yellow-400"
                                                                    : "bg-green-500"
                                                            : "bg-[#E8EDF3]"
                                                            }`}
                                                    />
                                                ))}
                                            </div>

                                            <p className="mb-1 text-[10px] text-[#778398]">Password must contain:</p>

                                            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                                <PasswordRule valid={passwordChecks.length} text="8+ characters" />
                                                <PasswordRule valid={passwordChecks.uppercase} text="Uppercase letter" />
                                                <PasswordRule valid={passwordChecks.lowercase} text="Lowercase letter" />
                                                <PasswordRule valid={passwordChecks.number} text="Number" />
                                                <PasswordRule valid={passwordChecks.special} text="Special character" />
                                            </div>
                                        </div>
                                    )}

                                    {errors.newPassword && (
                                        <p className="mt-1 text-[11px] text-red-500">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-5">
                                    <label className="mb-1.5 block text-[14px] font-medium text-[#0A1931]">
                                        Confirm New Password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={14}
                                            strokeWidth={1.5}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA6B7]"
                                        />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password",
                                                validate: (value) => value === password || "Passwords do not match",
                                            })}
                                            className={`h-[38px] w-full rounded-md border bg-white pl-9 pr-10 text-[13px] text-[#4A5568] outline-none placeholder:text-[#4A5568] focus:ring-1 ${errors.confirmPassword
                                                ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                                : "border-[#DCE2EB] focus:border-[#1473EA] focus:ring-[#1473EA]/20"
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9BA6B7] hover:text-[#526174]"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>

                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-[11px] text-red-500">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex h-[38px] w-full items-center justify-center rounded-md bg-[#1473EA] text-sm font-medium text-white transition hover:bg-[#1162cc] disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdatePassword;