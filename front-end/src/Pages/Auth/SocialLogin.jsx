import React, { useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router';

const SocialLogin = () => {
    const axiosInstance = useAxios();
    const location = useLocation();
    const [loadingProvider, setLoadingProvider] = useState(null);

    const buildRedirectPath = (from) => {
        if (!from) return null;
        if (typeof from === "string") return from; // Return from directly if it is already a string.
        return `${from.pathname || "/"}${from.search || ""}${from.hash || ""}`;
    };

    const handleGoogleLogin = () => {
        setLoadingProvider("google");
        const redirectPath = buildRedirectPath(location.state?.from);
        if (redirectPath) {
            localStorage.setItem("postLoginRedirect", redirectPath);
        }
        window.location.href = `http://localhost:3000/api/auth/google`;
    };

    const handleGithubLogin = () => {
        setLoadingProvider("github");
        const redirectPath = buildRedirectPath(location.state?.from);
        if (redirectPath) {
            localStorage.setItem("postLoginRedirect", redirectPath);
        }
        window.location.href = `http://localhost:3000/api/auth/github`;
    };

    return (
        <div className="grid grid-cols-2 gap-2.5">

            {/* Google */}
            <button
                onClick={handleGoogleLogin}
                disabled={loadingProvider !== null}
                type="button"
                className="
                    flex
                    h-[38px]
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    border
                    cursor-pointer
                    border-[#E1E5EB]
                    text-[13px]
                    font-medium
                    text-[#4A5568]
                    transition
                    hover:bg-[#F8FAFC]
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                "
            >
                {loadingProvider === 'google' ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#4285F4]" />
                        <span>Redirecting...</span>
                    </>
                ) : (
                    <>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                fill="#4285F4"
                                d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.45a5.51 5.51 0 0 1-2.39 3.62v3.01h3.87c2.27-2.09 3.56-5.17 3.56-8.66Z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.87-3.01c-1.07.72-2.44 1.15-4.06 1.15-3.13 0-5.79-2.12-6.74-4.97H1.26v3.1A12 12 0 0 0 12 24Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.26 14.27A7.22 7.22 0 0 1 4.88 12c0-.79.14-1.55.38-2.27V6.63H1.26A12 12 0 0 0 0 12c0 1.93.46 3.76 1.26 5.37l4-3.1Z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 4.76c1.76 0 3.34.61 4.58 1.81l3.43-3.43C17.94 1.17 15.24 0 12 0A12 12 0 0 0 1.26 6.63l4 3.1c.95-2.85 3.61-4.97 6.74-4.97Z"
                            />
                        </svg>
                        <span>Google</span>
                    </>
                )}
            </button>

            {/* GitHub */}
            <button
                onClick={handleGithubLogin}
                disabled={loadingProvider !== null}
                type="button"
                className="
                    flex
                    h-[38px]
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    border
                    border-[#E1E5EB]
                    text-[13px]
                    font-medium
                    text-[#4A5568]
                    transition
                    hover:bg-[#F8FAFC]
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                "
            >
                {loadingProvider === 'github' ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#24292F]" />
                        <span>Redirecting...</span>
                    </>
                ) : (
                    <>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-[#24292F]"
                        >
                            <path
                                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18A11 11 0 0 1 12 5.9c.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.67.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                            />
                        </svg>
                        <span>GitHub</span>
                    </>
                )}
            </button>

        </div>
    );
};

export default SocialLogin;