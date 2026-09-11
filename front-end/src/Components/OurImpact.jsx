import React from 'react'

import iconPatients from '../assets/svg-icon/users.svg'
import activity from '../assets/svg-icon/activity.svg'
import award from '../assets/svg-icon/award.svg'
import starsvgrepocom from '../assets/svg-icon/star-svgrepo-com.svg'
import videoImage from '../assets/svg-icon/video-image-container.svg'
import right from '../assets/svg-icon/right.svg'
import aw from '../assets/svg-icon/award (2).svg'
import { Calendar, Phone } from 'lucide-react'

const OurImpact = () => {
    return (
        <section className='bg-[#f8fbfe]'>
            <div className='max-w-7xl mx-auto '>
                <div className='  py-24'>

                    <div className='mx-4  bg-[#f0f8fe] rounded-md p-12 '>
                        <div className='text-center '>
                            <h2 className='text-2xl font-bold uppercase text-[#0066FE]'>Our Impact </h2>
                            <h1 className='text-3xl font-semibold text-[#0A1931] mt-2'>
                                Healthcare You Can Count On
                            </h1>

                        </div>

                        <div className=' grid grid-cols-4 divide-x-2 divide divide-[#c1d5f7] gap-11  mt-16'>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                                    <img src={iconPatients} alt="male" className='w-8 h-8' />
                                </div>
                                <div>
                                    <h1 className="font-bold text-2xl leading-4  text-[#0A1931]">Patient First</h1>
                                    <p className="text-[#4A5568] mt-1 text-[13px] leading-[15px] max-w-[120px]">Happy Patients</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                                    <img src={activity} alt="male" className='w-8 h-8' />
                                </div>
                                <div>
                                    <h1 className="font-bold text-2xl leading-4  text-[#0A1931]">30+ </h1>
                                    <p className="text-[#4A5568] mt-1 text-[13px] leading-[15px] max-w-[120px]">Expert Doctors</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                                    <img src={award} alt="male" className='w-8 h-8' />
                                </div>
                                <div>
                                    <h1 className="font-bold text-2xl leading-4  text-[#0A1931]">20+ </h1>
                                    <p className="text-[#4A5568] mt-1 text-[13px] leading-[15px] max-w-[120px]">Medical Specialties</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                                    <img src={starsvgrepocom} alt="male" className='w-8 h-8' />
                                </div>
                                <div>
                                    <h1 className="font-bold text-2xl leading-4  text-[#0A1931]">98% </h1>
                                    <p className="text-[#4A5568] mt-1 text-[13px] leading-[15px] max-w-[120px]">Patient Satisfaction</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='mx-4 relative flex items-start rounded-md py-12 gap-4 '>
                    <div className=''>
                        <h2 className='text-2xl text-center font-bold uppercase text-[#0066FE]'>Why Choose Us </h2>
                        <h1 className='text-3xl text-center font-semibold text-[#0A1931] mt-2'>
                            We Put Your Health <span className='text-[#0066FE]'>First</span>
                        </h1>
                        <p className='text-gray-600 text-center mt-3 text-[12px]'>
                            Experience the difference of personalized care <br /> and advanced medical solutions.
                        </p>

                        <div>
                            <div className='flex items-start space-x-4 mt-5 '>
                                <div className='w-6 h-6 bg-[#0066FE] rounded-full mt-1 flex items-center justify-center'>
                                    <img src={right} alt="male" className='w-5 h-5 p-1 ' />
                                </div>
                                <div>
                                    <h1 className='text-[#0A1931] font-bold text-[16px] '>Experienced Doctors</h1>
                                    <p className='text-[#4A5568] text-[14px]'>Our doctors are highly qualified and specialized in their fields.</p>
                                </div>

                            </div>
                            <div className='flex items-start space-x-4 mt-5 '>
                                <div className='w-6 h-6 bg-[#0066FE] rounded-full mt-1 flex items-center justify-center'>
                                    <img src={right} alt="male" className='w-5 h-5 p-1 ' />
                                </div>
                                <div>
                                    <h1 className='text-[#0A1931] font-bold text-[16px] '>Advanced Technology</h1>
                                    <p className='text-[#4A5568] text-[14px]'>State-of-the-art technology for accurate diagnosis and effective treatment.</p>
                                </div>

                            </div>
                            <div className='flex items-start space-x-4 mt-5 '>
                                <div className='w-6 h-6 bg-[#0066FE] rounded-full mt-1 flex items-center justify-center'>
                                    <img src={right} alt="male" className='w-5 h-5 p-1 ' />
                                </div>
                                <div>
                                    <h1 className='text-[#0A1931] font-bold text-[16px] '>Personalized Care</h1>
                                    <p className='text-[#4A5568] text-[14px]'>We create treatment plans tailored to your unique needs.</p>
                                </div>

                            </div>
                            <div className='flex items-start space-x-4 mt-5 '>
                                <div className='w-6 h-6 bg-[#0066FE] rounded-full mt-1 flex items-center justify-center'>
                                    <img src={right} alt="male" className='w-5 h-5 p-1 ' />
                                </div>
                                <div>
                                    <h1 className='text-[#0A1931] font-bold text-[16px] '>24/7 Support</h1>
                                    <p className='text-[#4A5568] text-[14px]'>We are here for you anytime you need us.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='ml-auto rounded-2xl '>
                        <img src={videoImage} alt="male" className='w-[600px] h-[400px]' />
                    </div>

                    <div className='bg-white absolute bottom-12 right-0 rounded-2xl p-3 shadow-md '>

                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0'>
                                <img src={aw} alt="male   " className='w-6 h-6' />
                            </div>
                            <div>
                                <h1 className='text-[#0A1931] font-extrabold text-[16px] '>20+ </h1>
                                <p className='text-[#4A5568] text-[14px]'>Years of Excellence</p>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='mx-4 flex items-center bg-[#0066FE] rounded-2xl p-12'>
                    <div>
                        <h1 className='text-white font-bold text-3xl'>Ready to Take the Next Step?</h1>
                        <p className='text-[#E1EDFE] text-[15px]'>Book an appointment with our experts and take <br /> control of your health today.</p>
                    </div>

                    <div className='flex ml-auto gap-4 items-center my-4'>
                        <button className='flex items-center cursor-pointer justify-center bg-white font-semibold text-[#0066FE] rounded-xl px-5 py-3 transition-all duration-300'>
                            <Calendar color="#0066FE" className='mr-2' />
                            Book Appointment
                        </button>

                        <button className='flex items-center cursor-pointer justify-center outline-2 outline-[#E2E8F0] bg-transparent text-white rounded-xl font-semibold px-5 py-3 transition-all duration-300'>
                            <Phone color="#ffffff" className='mr-2' />
                            Talk to Doctor
                        </button>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default OurImpact