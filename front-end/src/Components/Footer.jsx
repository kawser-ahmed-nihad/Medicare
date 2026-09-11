import { Clock, HeartPulse, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
const quickLinks = [
  "Home",
  "Services",
  "Doctors",
  "About Us",
  "Blog",
  "Contact",
];

const services = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Pulmonology",
  "And More",
];

const supportLinks = [
  "FAQs",
  "Privacy Policy",
  "Terms & Conditions",
  "Appointment Policy",
  "Insurance Policy",
];

const Footer = () => {
  return (
    <footer className="border-t  bg-linear-to-r to-[#142744] from-[#0A1628]  border-[#EEF3F8] ">

      <div className="mx-auto max-w-7xl px-5 py-20">

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1683E8]">
                <img src="/public/logo-icon-bg.svg" alt="" />
              </div>

              <h3 className="text-2xl font-extrabold text-white">
                Medicare
              </h3>
            </div>

            <p className="mt-3 text-[14px] leading-4 text-[#94A3B8]">
              Our medical clinic provides state-of-the-art diagnostic and clinical treatments under one roof, guided by a standard of clinical excellence.
            </p>

            {/* Social Icons */}
            <div className="mt-4 flex gap-2">
              {[FaFacebook, FaLinkedin, FaInstagram, FaXTwitter].map(
                (Icon, index) => (
                  <a
                    href="#"
                    key={index}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#667085] transition hover:bg-[#0066FE] hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="">
            <h4 className="mb-3 text-[16px] font-bold text-white">
              Quick Links
            </h4>

            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[14px] text-[#667085] hover:text-[#94A3B8]"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-3 text-[16px] font-bold text-white">
              Our Services
            </h4>

            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[14px] text-[#667085] hover:text-[#1683E8]"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-3 text-[16px] font-bold text-white">
              Support
            </h4>

            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[14px] text-[#667085] hover:text-[#1683E8]"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-[16px] font-bold text-white">
              Contact Us
            </h4>

            <div className="space-y-2.5">

              <div className="flex gap-2">
                <MapPin

                  className="mt-[1px] shrink-0  w-3 h-3 text-[#1683E8]"
                />

                <p className="text-[14px] leading-3.5 text-[#667085]">
                  123 Health Street,
                  <br />
                  New York, NY 10001
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Phone

                  className="text-[#1683E8]  w-3 h-3"
                />

                <p className="text-[14px] text-[#667085]">
                  +1 (555) 123-4567
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Mail

                  className="text-[#1683E8]  w-3 h-3"
                />

                <p className="text-[14px] text-[#667085]">
                  info@medicare.com
                </p>
              </div>

              <div className="flex gap-2">
                <Clock

                  className="mt-[1px] w-3 h-3 text-[#1683E8]"
                />

                <p className="text-[14px] leading-3.5 text-[#667085]">
                  Mon - Sat: 8:00 AM - 8:00 PM
                </p>
              </div>

            </div>
          </div>

        </div>

        <div className="pt-20">
          <div className="border-t  border-white/5 flex items-center py-2.5 text-center">
            <p className="text-[13px] text-[#98A2B3]">
              © 2026 Medicare Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 ml-auto items-center text-[13px] text-[#94A3B8]">
              <p>
                Privacy Policy
              </p>
              <p>
                Terms of Service
              </p>
              <p>
                HIPAA Compliance
              </p>
            </div>

          </div>
        </div>


      </div>



    </footer>
  );
};

export default Footer;