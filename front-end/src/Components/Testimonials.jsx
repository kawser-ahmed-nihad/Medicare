import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "James Anderson",
    role: "Cardiology Patient",
    image: "https://i.pravatar.cc/100?img=12",
    rating: 5,
    text: "The doctors and staff were amazing. They explained everything clearly and made me feel comfortable.",
  },
  {
    id: 2,
    name: "Emily Brown",
    role: "Neurology Patient",
    image: "https://i.pravatar.cc/100?img=47",
    rating: 5,
    text: "Excellent service and very caring team. I highly recommend MedCare for everyone.",
  },
  {
    id: 3,
    name: "Michael Davis",
    role: "Orthopedics Patient",
    image: "https://i.pravatar.cc/100?img=11",
    rating: 5,
    text: "From appointment to treatment, everything was smooth and professional.",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    role: "Dermatology Patient",
    image: "https://i.pravatar.cc/100?img=32",
    rating: 5,
    text: "The entire experience was wonderful. The doctor listened carefully and explained my treatment.",
  },
  {
    id: 5,
    name: "Daniel Miller",
    role: "Dental Patient",
    image: "https://i.pravatar.cc/100?img=13",
    rating: 5,
    text: "Very friendly staff and a clean environment. I felt comfortable throughout my visit.",
  },
  {
    id: 6,
    name: "Olivia Taylor",
    role: "Pediatrics Patient",
    image: "https://i.pravatar.cc/100?img=44",
    rating: 5,
    text: "The doctor was extremely patient and caring. Everything was explained in a simple way.",
  },
  {
    id: 7,
    name: "William Moore",
    role: "Cardiology Patient",
    image: "https://i.pravatar.cc/100?img=14",
    rating: 5,
    text: "Booking an appointment was easy and the medical team was very professional and helpful.",
  },
  {
    id: 8,
    name: "Sophia Martin",
    role: "Neurology Patient",
    image: "https://i.pravatar.cc/100?img=49",
    rating: 5,
    text: "I had a great experience with the medical team. They were kind, professional and knowledgeable.",
  },
  {
    id: 9,
    name: "Robert Thompson",
    role: "Orthopedics Patient",
    image: "https://i.pravatar.cc/100?img=15",
    rating: 5,
    text: "The treatment was excellent and the staff made the whole process easy and stress-free.",
  },
  {
    id: 10,
    name: "Isabella Clark",
    role: "General Patient",
    image: "https://i.pravatar.cc/100?img=45",
    rating: 5,
    text: "Amazing service from start to finish. I would definitely recommend this healthcare team.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-[#f8fbfe] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">

    
        <div className="mb-10 text-center">
          <p className="mb-2 text-2xl font-bold uppercase tracking-wide text-[#2787E8]">
            Testimonials
          </p>

          <h2 className="text-3xl font-bold text-[#14213D] sm:text-3xl md:text-[32px]">
            What Our Patients{" "}
            <span className="text-[#1683E8]">Say</span>
          </h2>
        </div>

   
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="testimonial-slider !pb-12"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="h-full min-h-[205px] rounded-xl border border-[#EDF2F7] bg-white p-5 shadow-[0_8px_30px_rgba(30,70,100,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(30,70,100,0.1)] sm:p-6">

                
                <div className="mb-3 flex gap-[2px]">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <span
                      key={index}
                      className="text-[14px] leading-none text-[#FFB800]"
                    >
                      ★
                    </span>
                  ))}
                </div>

              
                <p className="min-h-[72px] text-[13px] leading-6 text-[#667085]">
                  "{item.text}"
                </p>

         
                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#EAF4FF]"
                  />

                  <div>
                    <h3 className="text-[13px] font-bold text-[#1D2939]">
                      — {item.name}
                    </h3>

                    <p className="mt-[2px] text-[10px] text-[#98A2B3]">
                      {item.role}
                    </p>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

     
      <style>{`
        .testimonial-slider .swiper-pagination {
          bottom: 0px;
        }

        .testimonial-slider .swiper-pagination-bullet {
          width: 18px;
          height: 6px;
          border-radius: 999px;
          background: #D9E1EA;
          opacity: 1;
          margin: 0 4px !important;
          transition: all 0.3s ease;
        }

        .testimonial-slider .swiper-pagination-bullet-active {
          width: 18px;
          background: #1683E8;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;