import React from 'react'

import heart from '../assets/svg-icon/heart-care.svg'

const OurServices = () => {
    return (
        <div className='bg-[#f8fbfe]'>

            <div className='max-w-7xl mx-auto px-4 '>
                <div className='text-center py-20'>
                    <h2 className='text-3xl font-bold text-[#0066FE]'>Our Services </h2>
                    <h1 className='text-3xl font-semibold text-[#0A1931] mt-2'>
                        Comprehensive Healthcare <span className='text-[#0066FE]'>Services</span>
                    </h1>
                    <p className='text-gray-600 mt-3 text-[12px]'>
                        We offer a wide range of medical service
                        medical services to meet your <br />
                        healthcare needs under one roof.
                    </p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 '>
                    <div className=' bg-white flex flex-col  items-center rounded-lg shadow-md p-6 text-center'>
                        <img src={heart} alt="Heart Care" className=' w-10 h-10 ' />
                        <h1>Cardiology</h1>
                        <p>Expert care for hese
                            heslth and related
                            condntions,</p>
                    </div>
                    <div className=' bg-white flex flex-col justify-center items-center rounded-lg shadow-md p-6 text-center'>
                        <img src={heart} alt="Heart Care" className=' w-10 h-10 ' />
                        <h1>Cardiology</h1>
                        <p>Expert care for hese
                            heslth and related
                            condntions,</p>
                    </div>
                    <div className=' bg-white flex flex-col justify-center items-center rounded-lg shadow-md p-6 text-center'>
                        <img src={heart} alt="Heart Care" className=' w-10 h-10 ' />
                        <h1>Cardiology</h1>
                        <p>Expert care for hese
                            heslth and related
                            condntions,</p>
                    </div>
                    <div className=' bg-white flex flex-col justify-center items-center rounded-lg shadow-md p-6 text-center'>
                        <img src={heart} alt="Heart Care" className=' w-10 h-10 ' />
                        <h1>Cardiology</h1>
                        <p>Expert care for hese
                            heslth and related
                            condntions,</p>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default OurServices