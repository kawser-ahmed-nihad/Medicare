import React from 'react'

import heart from '../assets/svg-icon/heart-care.svg'
import lungs from '../assets/svg-icon/lungs.svg'
import brain from '../assets/svg-icon/brain.svg'
import { Bone, UsersRound } from 'lucide-react'

const OurServices = () => {
    return (
        <div className='bg-[#f8fbfe]'>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 '>
                <div className='text-center py-20'>
                    <h2 className='text-2xl

                     font-bold uppercase text-[#0066FE]'>Our Services </h2>
                    <h1 className='text-3xl font-semibold text-[#0A1931] mt-2'>
                        Comprehensive Healthcare <span className='text-[#0066FE]'>Services</span>
                    </h1>
                    <p className='text-gray-600 mt-3 text-[12px]'>
                        We offer a wide range of medical service
                        medical services to meet your <br />
                        healthcare needs under one roof.
                    </p>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 '>
                    <div className=' bg-white flex space-y-2 flex-col  items-center rounded-lg shadow-md p-6 text-center'>
                        <div className="w-10 h-10 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                            <img src={heart} alt="Heart Care" className="w-8 h-8 flex mt-1 object-contain" />
                        </div>
                        <h1 className='text-[18px] font-bold '>Cardiology</h1>
                        <p className='text-[#4A5568] text-[13px]'>Expert care for hese
                            heslth and related
                            condntions,</p>
                    </div>
                    <div className=' bg-white flex flex-col  items-center rounded-lg shadow-md space-y-2 p-6 text-center'>
                        <div className="w-10 h-10 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                            <img src={brain} alt="Neurology Care" className="w-8 h-8 object-contain" />
                        </div>
                        <h1 className='text-[18px] font-bold '>Neurology</h1>
                        <p className='text-[#4A5568] text-[13px]'>
                            Advanced treatment
                            or brain, apine and
                            nervous system.</p>
                    </div>
                    <div className=' bg-white flex flex-col  items-center rounded-lg space-y-2 shadow-md p-6 text-center'>
                        <div className="w-10 h-10 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                            <img src={lungs} alt="Lungs Care" className="w-8 h-8 object-contain" />
                        </div>
                        <h1 className='text-[18px] font-bold '>Pulmonology</h1>
                        <p className='text-[#4A5568] text-[13px]'>
                            Respiratory care for a better and healthy life.</p>
                    </div>
                    <div className=' bg-white flex flex-col  items-center rounded-lg space-y-2 shadow-md p-6 text-center'>
                        <div className="w-10 h-10 rounded-full bg-[#c1d5f7] flex items-center  justify-center shrink-0">
                            <Bone className='text-[#3f87fc]  w-7 h-7 ' />
                        </div>
                        <h1 className='text-[18px] font-bold '>Orthopedics</h1>
                        <p className='text-[#4A5568] text-[13px]'>
                            Bone, joint and muscle care for active life.</p>
                    </div>
                    <div className=' bg-white flex flex-col  items-center rounded-lg space-y-2 shadow-md p-6 text-center'>
                        <div className="w-10 h-10 rounded-full bg-[#c1d5f7] flex items-center  justify-center shrink-0">
                            <svg
                                className='-mt-1'
                                width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="60" cy="60" r="46" fill="" />


                                <circle
                                    cx="60"
                                    cy="38"
                                    r="12"
                                    stroke="#2F7FE5"
                                    stroke-width="5"
                                />


                                <path
                                    d="M59.8 49
       C52.8 49 46.5 53.2 40.4 58.8
       L31.8 67
       C25.3 73.2 25.8 82.2 31.8 88.7
       C39.4 97 49.6 104.2 60 107
       C70.4 104.2 80.6 97 88.2 88.7
       C94.2 82.2 94.7 73.2 88.2 67
       L79.6 58.8
       C73.5 53.2 67.2 49 59.8 49Z"
                                    stroke="#2F7FE5"
                                    stroke-width="5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />


                                <path
                                    d="M34 70
       C41 63.5 48.5 63.5 54.5 69
       C58 72.2 61.2 74 64.8 73.8
       C69.2 73.5 71.7 69.7 75.2 66.9
       C80.1 63 85.5 63.7 89 68.5"
                                    stroke="#2F7FE5"
                                    stroke-width="5"
                                    stroke-linecap="round"
                                />


                                <path
                                    d="M50 76L55 88"
                                    stroke="#2F7FE5"
                                    stroke-width="5"
                                    stroke-linecap="round"
                                />


                                <path
                                    d="M70 76L65 88"
                                    stroke="#2F7FE5"
                                    stroke-width="5"
                                    stroke-linecap="round"
                                />
                            </svg>
                        </div>
                        <h1 className='text-[18px] font-bold '>Pediatrics</h1>
                        <p className='text-[#4A5568] text-[13px]'>
                            Compassionate care for your little ones.</p>
                    </div>
                    <div className=' bg-white flex flex-col  items-center rounded-lg space-y-2 shadow-md p-6 text-center'>
                        <div className="w-10 h-10 rounded-full bg-[#c1d5f7] flex items-center  justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">

                                <g fill="#2563EB" transform="translate(16, 16)">

                                    <circle cx="6" cy="6" r="3.5" />

                                    <circle cx="22" cy="6" r="3.5" />

                                    <circle cx="6" cy="22" r="3.5" />

                                    <circle cx="22" cy="22" r="3.5" />

                                    <polygon points="14,11 17,14 14,17 11,14" />
                                </g>
                            </svg>

                        </div>
                        <h1 className='text-[18px] font-bold '>And More</h1>
                        <p className='text-[#4A5568] text-[13px]'>
                            Many more specialities to ensure complete care for you.</p>
                    </div>

                </div>
            </div>


        </div>
    )
}

export default OurServices