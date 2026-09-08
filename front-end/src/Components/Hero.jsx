import React from 'react'

import calendar from '../assets/svg-icon/calendar.svg'
import phone from '../assets/svg-icon/phone.svg'
import doctor from '../assets/svg-icon/doctor.svg'
import heartCare from '../assets/svg-icon/heart-care.svg'
import meditrust from '../assets/svg-icon/meditrust.svg'
import starSvgrepocom from '../assets/svg-icon/star-svgrepo-com.svg'

import hero from '../assets/heropic.png'
import croppedImage from '../assets/circle_image.png'
const Star = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#FFC107"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const Hero = () => {
  return (
    <div className='bg-gradient-to-br from-[#F8FBFE] via-[#EAF4FC] to-[#DCEEFF] pt-8 overflow-hidden'>
      <div className='max-w-7xl px-4 mx-auto'>
        {/* Hero Main Content */}
        <div className='flex items-end justify-between gap-10'>

          {/* Left Text Content */}
          <div className='space-y-4 flex flex-col justify-center items-start pb-10'>
            <h1 className="text-[#102A4C] font-extrabold text-6xl leading-tight">
              Your Health, <br />
              Our <span className="text-[#0B7CFF]">Priority</span>
            </h1>
            <p className="text-[#53657D]">
              We provide personalized healthcare solutions with <br />
              compassion, advanced technology, and a team of <br />
              dedicated professionals.
            </p>

            <div className='flex gap-4 items-center my-4'>
              <button className='flex items-center justify-center bg-[#0B7CFF] hover:bg-[#0868D9] font-semibold text-white rounded-xl px-5 py-3 transition-all duration-300'>
                <img className='mr-2' src={calendar} alt="Calendar Icon" />
                Book Appointment
              </button>

              <button className='flex items-center justify-center outline-2 outline-[#E2E8F0] bg-transparent text-black rounded-xl font-semibold px-5 py-3 transition-all duration-300'>
                <img className='mr-2' src={phone} alt="Phone Icon" />
                Talk to Doctor
              </button>
            </div>

            <div className='flex gap-6 items-center pt-2'>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                  <img src={doctor} alt="Expert Doctors" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <h1 className="font-semibold text-[12px] leading-4 text-[#0A1931]">Expert Doctors</h1>
                  <p className="text-[#4A5568] text-[10px] leading-[15px] max-w-[120px]">Experienced & caring professionals</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                  <img src={meditrust} alt="Patient First" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <h1 className="font-semibold text-[12px] leading-4 text-[#0A1931]">Patient First</h1>
                  <p className="text-[#4A5568] text-[10px] leading-[15px] max-w-[120px]">Dedicated personal focus</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                  <img src={heartCare} alt="Heart Care" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <h1 className="font-semibold text-[12px] leading-4 text-[#0A1931]">Heart Care</h1>
                  <p className="text-[#4A5568] text-[10px] leading-[15px] max-w-[120px]">Dedicated personal focus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right SVG & Image Container */}
          <div className="relative w-[520px] h-[520px] grid grid-cols-1 grid-rows-1 translate-y-8 shrink-0">
            {/* SVG Background */}
            <svg
              viewBox="0 0 620 620"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="col-start-1 row-start-1 h-full w-full"
            >
              <defs>
                <radialGradient
                  id="heroBg"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(310 270) rotate(90) scale(300)"
                >
                  <stop offset="0" stopColor="#E8F4FF" />
                  <stop offset="0.7" stopColor="#F1F8FF" />
                  <stop offset="1" stopColor="#F8FBFF" />
                </radialGradient>
              </defs>

              {/* Background Container */}
              <rect width="620" height="620" rx="32" fill="none" />

              {/* ব্যাকগ্রাউন্ড বৃত্ত (হলুদ অংশের জন্য) - কালার কিছুটা গাঢ় ও সলিড করা হয়েছে */}
              <circle cx="310" cy="280" r="245" fill="#E1EFFE" opacity="1" />
              <circle cx="310" cy="280" r="205" fill="#E1EFFE" opacity="1" />

              {/* ECG Line (শুধু লাল রঙের চিহ্নিত অংশটুকু রাখা হয়েছে) */}
              <path
                d="M20 330 H85 L105 330 L132 285 L158 375 L195 220 L235 350 L270 305 L300 330 H370"
                stroke="#7BB8FF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
            </svg>

            {/* Hero Image - Aligned to Bottom */}
            <div className="col-start-1  row-start-1 z-10 flex items-end justify-center">
              <div className=" z-20 absolute top-20 right-20 p-3  bg-white justify-center rounded-md">
                <div className='flex items-center gap-2'>
                  <div className="w-8 h-8 rounded-full bg-[#c1d5f7] flex items-center justify-center shrink-0">
                    <img src={doctor} alt="Expert Doctors" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <h1 className='font-bold'>20+</h1>
                    <p className='text-[#4A5568] text-[10px]'>Specialties</p>
                  </div>
                </div>

              </div>
              <div className=" z-20 absolute top-50 right-0 p-3  bg-white justify-center rounded-md">
                <div className='flex items-center gap-2'>
                  <div className="w-8 h-8 rounded-full bg-[#caf2db] flex items-center justify-center shrink-0">
                    <img src={starSvgrepocom} alt="Expert Doctors" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <h1 className='font-bold'>20+</h1>
                    <p className='text-[#4A5568] text-[10px]'>Patient Satisfaction</p>
                  </div>
                </div>

              </div>


              <img
                src={hero}
                alt="Hero Image"
                className="h-[520px] w-auto translate-y-6 object-contain"
              />

              <div className=" z-20 absolute bottom-20 left-0 p-3  bg-white justify-center rounded-md">
                <div className='flex items-start gap-2'>
                  <div className=" rounded-full  flex items-center justify-center shrink-0">
                    <img src={croppedImage} alt="Expert Doctors" className="w-10 h-10 object-contain rounded-full" />
                  </div>
                  <div>
                    <h1 className='font-bold'>Dr. Sarah Johnson</h1>
                    <p className='text-[#4A5568] text-[10px]'> Cardiologist</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} />

                      ))}
                      <p className='text-[10px] text-[#4A5568]'>4.9 (120 Reviews)</p>
                    </div>
                  </div>
                </div>



              </div>

            </div>


          </div>

        </div>

        {/* Bottom Banner */}
        <div className='pb-10 -mt-4 z-40 relative '>
          <div className='bg-white flex items-center justify-between px-8 py-5 rounded-xl shadow-sm'>
            <h1 className="font-semibold text-[16px] whitespace-nowrap">
              Trusted by Leading Organisations
            </h1>

            <div className='flex items-center justify-between w-full max-w-3xl ml-8'>
              <div className='flex gap-1.5 items-center'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3V7H5C3.89543 7 3 7.89543 3 9V10C3 11.1046 3.89543 12 5 12H9V16C9 17.1046 9.89543 18 11 18H12C13.1046 18 14 17.1046 14 16V12H18C19.1046 12 20 11.1046 20 10V9C20 7.89543 19.1046 7 18 7H14V3C14 1.89543 13.1046 1 12 1H11C9.89543 1 9 1.89543 9 3Z" stroke="#5B9FEF" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                <h1 className="font-bold text-[#4A5568] text-[18px]">HealthCare</h1>
              </div>

              <div className='flex gap-1.5 items-center'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.84 4.61C20.3292 4.09901 19.7226 3.69365 19.065 3.4171C18.4075 3.14055 17.7019 2.99823 16.99 2.99823C16.2781 2.99823 15.5725 3.14055 14.915 3.4171C14.2574 3.69365 13.6508 4.09901 13.14 4.61L12 5.75L10.86 4.61C9.82767 3.57767 8.4272 2.9977 6.96667 2.9977C5.50613 2.9977 4.10566 3.57767 3.07333 4.61C2.041 5.64233 1.46103 7.0428 1.46103 8.50333C1.46103 9.96387 2.041 11.3643 3.07333 12.3967L12 21.3233L20.9267 12.3967C21.939 11.3643 22.5229 9.96927 22.5229 8.51333C22.5229 7.05739 21.939 5.66233 20.84 4.61Z" stroke="#72B0F4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h1 className="font-bold text-[#4A5568] text-[18px]">MediPlus</h1>
              </div>

              <div className='flex gap-1.5 items-center'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.5 3.5C13.5 3.5 7.5 5.5 5 10.5C2.5 15.5 6 20.5 10.5 20.5C15 20.5 20.5 15 20.5 3.5Z" stroke="#62A9EF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 20C7.5 16 11 12.5 16.5 9" stroke="#62A9EF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h1 className="font-bold text-[#4A5568] text-[18px]">LifeCare</h1>
              </div>

              <div className='flex gap-1.5 items-center'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z" stroke="#5B9FEF" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                <h1 className="font-bold text-[#4A5568] text-[18px]">CareWell</h1>
              </div>

              <div className='flex gap-1.5 items-center'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L20 6V11.5C20 16.5 16.7 20.2 12 21.5C7.3 20.2 4 16.5 4 11.5V6L12 3Z" stroke="#67A9ED" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12L11 14L15 10" stroke="#67A9ED" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h1 className="font-bold text-[#4A5568] text-[16px]">MedTrust</h1>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Hero