import { useRef, useState } from "react";
import {
    User,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
    Check,
    Camera,
    X,
} from "lucide-react";
import { Loader2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import SocialLogin from "./SocialLogin";
import { Link, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const password = watch("password", "");

    // -----------------------------
    // Password strength
    // -----------------------------
    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const passwordStrength =
        Object.values(passwordChecks).filter(Boolean).length;

    // -----------------------------
    // Photo
    // -----------------------------
    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // 5MB validation
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5MB.");
            e.target.value = "";
            return;
        }

        // File type validation
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG or WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        setPhotoFile(file);
        setPhoto(URL.createObjectURL(file));

        // React Hook Form value
        setValue("profilePhoto", file, {
            shouldValidate: true,
        });
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoFile(null);

        setValue("profilePhoto", null, {
            shouldValidate: true,
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // -----------------------------
    // Submit
    // -----------------------------
    const onSubmit = async (data) => {
        setLoading(true);

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("confirmPassword", data.confirmPassword);
        formData.append("agree", data.agree);
        if (photoFile) {
            formData.append("avatar", photoFile); // The "avatar" field name must match the backend's Multer field name.
        }




        try {
            const res = await axiosInstance.post("/api/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Save the email for the verification page.
            localStorage.setItem(
                "pendingVerificationEmail",
                data.email
            );
            navigate('/auth/login');
            // console.log(
            //     "Saved:",
            //     localStorage.getItem("pendingVerificationEmail")
            // );

            if (res.data.message) {
                toast.success(
                    res.data.message ||
                    "Account created! Please check your email."
                );
            }

        } catch (err) {
            console.error(err);

            toast.error(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Registration failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="rounded-xl bg-white p-6 shadow-[0_8px_30px_rgba(30,70,100,0.05)] sm:p-7">

                {/* Header */}
                <div className="mb-5">
                    <h1 className="text-2xl font-semibold text-[#0A1931]">
                        Create Account
                    </h1>

                    <p className="mt-1.5 text-[12px] text-[#4A5568]">
                        Create your account to get started with better healthcare
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Profile Photo */}
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
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={handlePhotoChange}
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
                                {...register("name", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Name must be at least 3 characters",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Name cannot exceed 50 characters",
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s.'-]+$/,
                                        message: "Please enter a valid name",
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
                  ${errors.name
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                        : "border-[#DCE2EB] focus:border-[#1473EA] focus:ring-[#1473EA]/20"
                                    }
                `}
                            />
                        </div>

                        {errors.name && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.name.message}
                            </p>
                        )}
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
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                    validate: {
                                        uppercase: (value) =>
                                            /[A-Z]/.test(value) ||
                                            "Password needs an uppercase letter",

                                        lowercase: (value) =>
                                            /[a-z]/.test(value) ||
                                            "Password needs a lowercase letter",

                                        number: (value) =>
                                            /[0-9]/.test(value) ||
                                            "Password needs a number",

                                        special: (value) =>
                                            /[^A-Za-z0-9]/.test(value) ||
                                            "Password needs a special character",
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

                        {/* Password Strength */}
                        {password && (
                            <div className="mt-2">

                                <div className="mb-1.5 flex gap-1">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div
                                            key={item}
                                            className={`
                        h-[3px]
                        flex-1
                        rounded-full
                        transition
                        ${item <= passwordStrength
                                                    ? passwordStrength <= 2
                                                        ? "bg-red-400"
                                                        : passwordStrength <= 3
                                                            ? "bg-yellow-400"
                                                            : "bg-green-500"
                                                    : "bg-[#E8EDF3]"
                                                }
                      `}
                                        />
                                    ))}
                                </div>

                                <p className="mb-1 text-[10px] text-[#778398]">
                                    Password must contain:
                                </p>

                                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                    <PasswordRule
                                        valid={passwordChecks.length}
                                        text="8+ characters"
                                    />

                                    <PasswordRule
                                        valid={passwordChecks.uppercase}
                                        text="Uppercase letter"
                                    />

                                    <PasswordRule
                                        valid={passwordChecks.lowercase}
                                        text="Lowercase letter"
                                    />

                                    <PasswordRule
                                        valid={passwordChecks.number}
                                        text="Number"
                                    />

                                    <PasswordRule
                                        valid={passwordChecks.special}
                                        text="Special character"
                                    />
                                </div>
                            </div>
                        )}

                        {errors.password && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.password.message}
                            </p>
                        )}
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
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
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
                  ${errors.confirmPassword
                                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                                        : "border-[#DCE2EB] focus:border-[#1473EA] focus:ring-[#1473EA]/20"
                                    }
                `}
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

                        {errors.confirmPassword && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="mb-4">
                        <div className="flex items-center gap-1.5">

                            <button
                                type="button"
                                onClick={() => {
                                    setValue("agree", !watch("agree"), {
                                        shouldValidate: true,
                                    });
                                }}
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
                  ${watch("agree")
                                        ? "border-[#1473EA] bg-[#1473EA]"
                                        : errors.agree
                                            ? "border-red-400 bg-white"
                                            : "border-[#D5DCE6] bg-white"
                                    }
                `}
                            >
                                {watch("agree") && (
                                    <Check
                                        size={9}
                                        strokeWidth={3}
                                        className="text-white"
                                    />
                                )}
                            </button>

                            <span className="text-[12px] text-[#778398]">
                                I agree to{" "}
                                <Link
                                    to="/terms"
                                    className="font-medium text-[#1473EA] hover:underline"
                                >
                                    Terms & Conditions
                                </Link>
                            </span>
                        </div>

                        <input
                            type="checkbox"
                            className="hidden"
                            {...register("agree", {
                                required: "You must agree to the terms",
                            })}
                        />

                        {errors.agree && (
                            <p className="mt-1 text-[11px] text-red-500">
                                {errors.agree.message}
                            </p>
                        )}
                    </div>

                    {/* Create Account */}
                    <button
                        type="submit"
                        disabled={loading} // Disable the button while loading.
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
                                <span>Creating...</span>
                            </>
                        ) : (
                            "Create Account"
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
    );
};


// -----------------------------
// Password Rule Component
// -----------------------------
const PasswordRule = ({ valid, text }) => {
    return (
        <div className="flex items-center gap-1">
            <Check
                size={10}
                strokeWidth={2.5}
                className={
                    valid ? "text-green-500" : "text-[#B8C0CC]"
                }
            />

            <span
                className={`text-[10px] ${valid ? "text-green-600" : "text-[#9BA6B7]"
                    }`}
            >
                {text}
            </span>
        </div>
    );
};

export default Register;

