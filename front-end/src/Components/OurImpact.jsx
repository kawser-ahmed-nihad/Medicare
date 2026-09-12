import React, { useRef, useState } from 'react'

import iconPatients from '../assets/svg-icon/users.svg'
import activity from '../assets/svg-icon/activity.svg'
import award from '../assets/svg-icon/award.svg'
import starsvgrepocom from '../assets/svg-icon/star-svgrepo-com.svg'
import right from '../assets/svg-icon/right.svg'
import aw from '../assets/svg-icon/award (2).svg'

import { Calendar, Phone, Play, Pause } from 'lucide-react'

const OurImpact = () => {
    const videoRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const handleMouseEnter = () => {
        if (window.innerWidth >= 768 && videoRef.current) {
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768 && videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
            setIsPlaying(false)
        }
    }

    const handleVideoClick = () => {
        if (!videoRef.current) return

        if (videoRef.current.paused) {
            videoRef.current.play()
            setIsPlaying(true)
        } else {
            videoRef.current.pause()
            setIsPlaying(false)
        }
    }

    return (
        <section className="bg-[#f8fbfe] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9">

                {/* =========================
                    OUR IMPACT
                ========================== */}
                <div className="py-12 sm:py-16 lg:py-24">

                    <div
                        className="
                            
                            bg-[#f0f8fe]
                            rounded-md
                            p-5
                            sm:p-8
                            lg:p-12
                        "
                    >

                        {/* Heading */}
                        <div className="text-center">
                            <h2
                                className="
                                    text-xl
                                    sm:text-2xl
                                    font-bold
                                    uppercase
                                    text-[#0066FE]
                                "
                            >
                                Our Impact
                            </h2>

                            <h1
                                className="
                                    text-2xl
                                    sm:text-3xl
                                    font-semibold
                                    text-[#0A1931]
                                    mt-2
                                "
                            >
                                Healthcare You Can Count On
                            </h1>
                        </div>


                        {/* Impact Items */}
                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-6
                                lg:gap-0
                                mt-10
                                sm:mt-12
                                lg:mt-16
                                lg:divide-x-2
                                lg:divide-[#c1d5f7]
                            "
                        >

                            {/* Patient First */}
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    lg:px-5
                                    first:lg:pl-0
                                "
                            >
                                <div
                                    className="
                                        w-12
                                        h-12
                                        rounded-full
                                        bg-[#c1d5f7]
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={iconPatients}
                                        alt="Patient First"
                                        className="w-8 h-8"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            font-bold
                                            text-xl
                                            sm:text-2xl
                                            leading-5
                                            text-[#0A1931]
                                        "
                                    >
                                        Patient First
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            mt-1
                                            text-[13px]
                                            leading-[15px]
                                        "
                                    >
                                        Happy Patients
                                    </p>
                                </div>
                            </div>


                            {/* Expert Doctors */}
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    lg:px-5
                                "
                            >
                                <div
                                    className="
                                        w-12
                                        h-12
                                        rounded-full
                                        bg-[#c1d5f7]
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={activity}
                                        alt="Expert Doctors"
                                        className="w-8 h-8"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            font-bold
                                            text-xl
                                            sm:text-2xl
                                            leading-5
                                            text-[#0A1931]
                                        "
                                    >
                                        30+
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            mt-1
                                            text-[13px]
                                            leading-[15px]
                                        "
                                    >
                                        Expert Doctors
                                    </p>
                                </div>
                            </div>


                            {/* Medical Specialties */}
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    lg:px-5
                                "
                            >
                                <div
                                    className="
                                        w-12
                                        h-12
                                        rounded-full
                                        bg-[#c1d5f7]
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={award}
                                        alt="Medical Specialties"
                                        className="w-8 h-8"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            font-bold
                                            text-xl
                                            sm:text-2xl
                                            leading-5
                                            text-[#0A1931]
                                        "
                                    >
                                        20+
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            mt-1
                                            text-[13px]
                                            leading-[15px]
                                        "
                                    >
                                        Medical Specialties
                                    </p>
                                </div>
                            </div>


                            {/* Patient Satisfaction */}
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    lg:px-5
                                    lg:pr-0
                                "
                            >
                                <div
                                    className="
                                        w-12
                                        h-12
                                        rounded-full
                                        bg-[#c1d5f7]
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={starsvgrepocom}
                                        alt="Patient Satisfaction"
                                        className="w-8 h-8"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            font-bold
                                            text-xl
                                            sm:text-2xl
                                            leading-5
                                            text-[#0A1931]
                                        "
                                    >
                                        98%
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            mt-1
                                            text-[13px]
                                            leading-[15px]
                                        "
                                    >
                                        Patient Satisfaction
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                {/* =========================
                    WHY CHOOSE US
                ========================== */}
                <div
                    className="
                        mx-4
                        relative
                        flex
                        flex-col
                        lg:flex-row
                        items-center
                        lg:items-start
                        rounded-md
                        py-8
                        sm:py-12
                        gap-8
                        lg:gap-6
                    "
                >

                    {/* Left Content */}
                    <div className="w-full lg:flex-1">

                        <h2
                            className="
                                text-xl
                                sm:text-2xl
                                text-center
                                font-bold
                                uppercase
                                text-[#0066FE]
                            "
                        >
                            Why Choose Us
                        </h2>

                        <h1
                            className="
                                text-2xl
                                sm:text-3xl
                                text-center
                                font-semibold
                                text-[#0A1931]
                                mt-2
                            "
                        >
                            We Put Your Health{' '}
                            <span className="text-[#0066FE]">
                                First
                            </span>
                        </h1>

                        <p
                            className="
                                text-gray-600
                                text-center
                                mt-3
                                text-[12px]
                                sm:text-[13px]
                                leading-5
                            "
                        >
                            Experience the difference of personalized care
                            <br className="hidden sm:block" />
                            {' '}and advanced medical solutions.
                        </p>


                        {/* Features */}
                        <div className="mt-6 sm:mt-7">

                            {/* Experienced Doctors */}
                            <div className="flex items-start gap-4 mt-5">
                                <div
                                    className="
                                        w-6
                                        h-6
                                        bg-[#0066FE]
                                        rounded-full
                                        mt-1
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={right}
                                        alt=""
                                        className="w-5 h-5 p-1"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            text-[#0A1931]
                                            font-bold
                                            text-[16px]
                                        "
                                    >
                                        Experienced Doctors
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            text-[13px]
                                            sm:text-[14px]
                                            leading-5
                                            mt-1
                                        "
                                    >
                                        Our doctors are highly qualified and
                                        specialized in their fields.
                                    </p>
                                </div>
                            </div>


                            {/* Advanced Technology */}
                            <div className="flex items-start gap-4 mt-5">
                                <div
                                    className="
                                        w-6
                                        h-6
                                        bg-[#0066FE]
                                        rounded-full
                                        mt-1
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={right}
                                        alt=""
                                        className="w-5 h-5 p-1"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            text-[#0A1931]
                                            font-bold
                                            text-[16px]
                                        "
                                    >
                                        Advanced Technology
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            text-[13px]
                                            sm:text-[14px]
                                            leading-5
                                            mt-1
                                        "
                                    >
                                        State-of-the-art technology for accurate
                                        diagnosis and effective treatment.
                                    </p>
                                </div>
                            </div>


                            {/* Personalized Care */}
                            <div className="flex items-start gap-4 mt-5">
                                <div
                                    className="
                                        w-6
                                        h-6
                                        bg-[#0066FE]
                                        rounded-full
                                        mt-1
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={right}
                                        alt=""
                                        className="w-5 h-5 p-1"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            text-[#0A1931]
                                            font-bold
                                            text-[16px]
                                        "
                                    >
                                        Personalized Care
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            text-[13px]
                                            sm:text-[14px]
                                            leading-5
                                            mt-1
                                        "
                                    >
                                        We create treatment plans tailored to
                                        your unique needs.
                                    </p>
                                </div>
                            </div>


                            {/* 24/7 Support */}
                            <div className="flex items-start gap-4 mt-5">
                                <div
                                    className="
                                        w-6
                                        h-6
                                        bg-[#0066FE]
                                        rounded-full
                                        mt-1
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={right}
                                        alt=""
                                        className="w-5 h-5 p-1"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            text-[#0A1931]
                                            font-bold
                                            text-[16px]
                                        "
                                    >
                                        24/7 Support
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            text-[13px]
                                            sm:text-[14px]
                                            leading-5
                                            mt-1
                                        "
                                    >
                                        We are here for you anytime you need us.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* =========================
                        VIDEO
                    ========================== */}
                    <div
                        className="
                            w-full
                            lg:w-[600px]
                          
                            shrink-0
                            relative
                        "
                    >
                        <div
                            className="
                                group
    relative
    w-full
    lg:w-[600px]
    h-[300px]
    sm:h-[360px]
    lg:h-[420px]
    overflow-hidden
    rounded-2xl
    bg-[#0A1931]
    shadow-lg
    cursor-pointer
                            "
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleVideoClick}
                        >

                            <video
                                ref={videoRef}
                                className="
                                    absolute
                                    inset-0
                                    w-[600px]
                                    h-[800px]
                                    object-cover
                                    transition-transform
                                    duration-700
                                    ease-out
                                    group-hover:scale-[1.03]
                                "
                                muted
                                loop
                                playsInline
                                preload="metadata"
                            >
                                <source
                                    src="https://www.pexels.com/download/video/8943930/"
                                    type="video/mp4"
                                />

                                Your browser does not support the video tag.
                            </video>


                            {/* Video Overlay */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-[#0A1931]/20
                                    transition-all
                                    duration-500
                                    group-hover:bg-[#0A1931]/10
                                "
                            />


                            {/* Play / Pause Button */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    flex
                                    items-center
                                    justify-center
                                    pointer-events-none
                                "
                            >
                                <div
                                    className="
                                        w-14
                                        h-14
                                        sm:w-16
                                        sm:h-16
                                        rounded-full
                                        bg-white/95
                                        flex
                                        items-center
                                        justify-center
                                        shadow-xl
                                        transition-all
                                        duration-500
                                        group-hover:scale-110
                                        group-hover:bg-white
                                    "
                                >
                                    {isPlaying ? (
                                        <Pause
                                            size={23}
                                            color="#0066FE"
                                            fill="#0066FE"
                                        />
                                    ) : (
                                        <Play
                                            size={25}
                                            color="#0066FE"
                                            fill="#0066FE"
                                            className="ml-1"
                                        />
                                    )}
                                </div>
                            </div>


                            {/* Soft Border */}
                            <div
                                className="
                                    absolute
                                    inset-0
                                    rounded-2xl
                                    ring-1
                                    ring-white/20
                                    transition-all
                                    duration-500
                                    group-hover:ring-white/40
                                "
                            />

                        </div>


                        {/* =========================
                            YEARS OF EXCELLENCE
                        ========================== */}
                        <div
                            className="
                                bg-white
                                absolute
                                bottom-0
                                right-0 
                                rounded-2xl
                                p-3
                                shadow-md
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-[#FEF3C7]
                                        flex
                                        items-center
                                        justify-center
                                        shrink-0
                                    "
                                >
                                    <img
                                        src={aw}
                                        alt=""
                                        className="w-6 h-6"
                                    />
                                </div>

                                <div>
                                    <h1
                                        className="
                                            text-[#0A1931]
                                            font-extrabold
                                            text-[16px]
                                        "
                                    >
                                        20+
                                    </h1>

                                    <p
                                        className="
                                            text-[#4A5568]
                                            text-[13px]
                                            sm:text-[14px]
                                        "
                                    >
                                        Years of Excellence
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>


                {/* =========================
                    CTA
                ========================== */}
                <div
                    className="
                        mx-4
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        bg-[#0066FE]
                        rounded-2xl
                        p-6
                        sm:p-8
                        lg:p-12
                        mt-12
                        lg:mt-0
                    "
                >

                    {/* CTA Text */}
                    <div className="text-center lg:text-left">
                        <h1
                            className="
                                text-white
                                font-bold
                                text-2xl
                                sm:text-3xl
                            "
                        >
                            Ready to Take the Next Step?
                        </h1>

                        <p
                            className="
                                text-[#E1EDFE]
                                text-[14px]
                                sm:text-[15px]
                                mt-2
                                leading-6
                            "
                        >
                            Book an appointment with our experts and take
                            <br className="hidden sm:block" />
                            {' '}control of your health today.
                        </p>
                    </div>


                    {/* CTA Buttons */}
                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            w-full
                            lg:w-auto
                            lg:ml-auto
                            gap-3
                            sm:gap-4
                            items-stretch
                            sm:items-center
                            mt-6
                            lg:mt-0
                        "
                    >

                        <button
                            className="
                                flex
                                items-center
                                cursor-pointer
                                justify-center
                                bg-white
                                font-semibold
                                text-[#0066FE]
                                rounded-xl
                                px-5
                                py-3
                                transition-all
                                duration-300
                                hover:shadow-lg
                                hover:-translate-y-0.5
                            "
                        >
                            <Calendar
                                color="#0066FE"
                                size={20}
                                className="mr-2"
                            />

                            Book Appointment
                        </button>


                        <button
                            className="
                                flex
                                items-center
                                cursor-pointer
                                justify-center
                                outline-2
                                outline-[#E2E8F0]
                                bg-transparent
                                text-white
                                rounded-xl
                                font-semibold
                                px-5
                                py-3
                                transition-all
                                duration-300
                                hover:bg-white/10
                                hover:-translate-y-0.5
                            "
                        >
                            <Phone
                                color="#ffffff"
                                size={20}
                                className="mr-2"
                            />

                            Talk to Doctor
                        </button>

                    </div>

                </div>

            </div>
        </section>
    )
}

export default OurImpact