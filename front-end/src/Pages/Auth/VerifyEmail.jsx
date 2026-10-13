import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Read the 'token' query parameter from the URL.
    const axiosInstance = useAxios();

    const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
    const [message, setMessage] = useState('Verifying your email, please wait...');
    const navigate = useNavigate();

    // ---- Resend verification state ----
    // Email saved to localStorage after successful registration on the Register page.
    // (In Register.jsx: localStorage.setItem('pendingVerificationEmail', data.email))
    const knownEmail = localStorage.getItem('pendingVerificationEmail') || '';

    // When VerifyEmail loads.
    console.log('Read:', knownEmail);
    const [isResending, setIsResending] = useState(false);
    const [resendSent, setResendSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        const handleEmailVerification = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing or invalid.');
                return;
            }

            try {
                // Send a request to the backend's email verification API.
                const res = await axiosInstance.post('/api/auth/verify-email', { token });

                if (res.data?.success || res.status === 200) {
                    setStatus('success');
                    setMessage(res.data?.message || 'Your email has been successfully verified!');
                    toast.success('Email verified successfully!');
                    localStorage.removeItem('pendingVerificationEmail'); // No longer needed.

                    // Automatically redirect to the login page after 3 seconds.
                    setTimeout(() => {
                        navigate('/auth/login');
                    }, 3000);
                }
            } catch (err) {
                console.error(err);
                setStatus('error');
                setMessage(
                    err.response?.data?.message ||
                    'Email verification failed or the link has expired.'
                );
                toast.error('Verification failed!');
            }
        };

        handleEmailVerification();
    }, [token, navigate]);

    // Cooldown timer — counts down every second once a resend has been sent
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleResendVerification = async () => {
        if (!knownEmail) return;

        setIsResending(true);
        try {
            // The backend always returns a generic success message to prevent email enumeration,
            // so this response is expected even if the account does not exist.
            const res = await axiosInstance.post('/api/auth/resend-verification', {
                email: knownEmail,
            });

            setResendSent(true);
            setCooldown(RESEND_COOLDOWN_SECONDS);
            toast.success(
                res.data?.message || 'If this account exists and is unverified, a new link has been sent.'
            );
        } catch (err) {
            console.error(err);
            // Handle cases where the backend rate limiter (authLimiter) is triggered.
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">

                {/* 1. Verifying state (loading animation) */}
                {status === 'verifying' && (
                    <div className="space-y-4">
                        <Loader2 className="w-16 h-16 text-[#1A73E8] animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-800">Verifying Email...</h2>
                        <p className="text-gray-500 text-sm">{message}</p>
                    </div>
                )}

                {/* 2. Success state */}
                {status === 'success' && (
                    <div className="space-y-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
                        <h2 className="text-2xl font-bold text-gray-800">Account Verified!</h2>
                        <p className="text-gray-600 text-sm">{message}</p>
                        <p className="text-xs text-gray-400">Redirecting to login page in 3 seconds...</p>

                        <div className="pt-2">
                            <Link
                                to="/auth/login"
                                className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#155FC0] transition-colors"
                            >
                                Login Now
                            </Link>
                        </div>
                    </div>
                )}

                {/* 3. Error / expired state */}
                {status === 'error' && (
                    <div className="space-y-4">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
                        <p className="text-red-500 text-sm">{message}</p>

                        <div className="pt-2">
                            {knownEmail ? (
                                !resendSent ? (
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500">
                                            Didn't get the link? We'll resend it to{' '}
                                            <span className="font-medium text-gray-700">{knownEmail}</span>
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            disabled={isResending || cooldown > 0}
                                            className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#155FC0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isResending ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Sending...
                                                </>
                                            ) : cooldown > 0 ? (
                                                `Resend in ${cooldown}s`
                                            ) : (
                                                <>
                                                    <RefreshCw size={16} />
                                                    Resend Verification Email
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                                        <p className="text-sm text-gray-600">
                                            A new verification link has been sent to{' '}
                                            <span className="font-medium">{knownEmail}</span>. Please check your inbox.
                                        </p>
                                        {cooldown > 0 ? (
                                            <p className="text-xs text-gray-400">
                                                You can request another link in {cooldown}s
                                            </p>
                                        ) : (
                                            <button
                                                onClick={handleResendVerification}
                                                className="text-xs font-semibold text-[#1A73E8] hover:underline"
                                            >
                                                Didn't get it? Send again
                                            </button>
                                        )}
                                    </div>
                                )
                            ) : (
                                // No email is stored in localStorage (for example, if the user switched devices or browsers, or cleared the cache).
                                // Offer only the option to return to registration or sign-in, without manual input.
                                <p className="text-xs text-gray-500">
                                    We couldn't find your email on this device. Please try registering
                                    again or sign in to request a new link.
                                </p>
                            )}

                            <div className="pt-4">
                                <Link
                                    to="/auth/login"
                                    className="text-xs text-gray-500 hover:text-[#1A73E8] hover:underline"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;