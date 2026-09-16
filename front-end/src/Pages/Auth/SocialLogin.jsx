import React from 'react'

const SocialLogin = () => {
    return (
        <div className="grid grid-cols-2  gap-2.5">

            {/* Google */}
            <button
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
          "
            >

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

                Google

            </button>

            {/* Facebook */}
            <button
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
          "
            >

                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <path
                        fill="#1877F2"
                        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.007 10.125 11.926v-8.437H7.078v-3.489h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.973h-1.514c-1.491 0-1.955.93-1.955 1.885v2.262h3.328l-.532 3.489h-2.796v8.437C19.612 23.08 24 18.092 24 12.073Z"
                    />
                </svg>

                Facebook

            </button>




        </div>
    )
}

export default SocialLogin