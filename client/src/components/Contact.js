import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export default function Contact() {
  return (
    <main className="flex-grow flex flex-col items-center mt-16 px-6 bg-white min-h-screen">
      <section
        className="max-w-6xl w-full rounded-3xl p-10 sm:p-14 mx-auto bg-white"
        style={{ minWidth: "320px", boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)" }}
      >
        <h1 className="text-center font-extrabold text-3xl mb-10 select-none">
          Contact
        </h1>
        <div className="bg-gradient-to-r from-[#0f3a8a] via-[#0066ff] to-[#7fb7ff] rounded-3xl p-6 mb-8 text-white">
          <h2 className="font-extrabold text-xl mb-3 select-none">Address</h2>
          <p className="text-base leading-relaxed max-w-4xl">
            Jl. Melati No. 27, Kelurahan Sukamaju, Kecamatan Cempaka Putih, Kota Jakarta Pusat, DKI Jakarta 10510
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 bg-gradient-to-r from-[#0f3a8a] via-[#0066ff] to-[#7fb7ff] rounded-3xl p-6 text-white">
            <h2 className="font-extrabold text-xl mb-4 select-none">Media Social</h2>
            <div className="flex space-x-6 text-3xl">
              <a aria-label="WhatsApp" className="hover:text-white" href="#">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
              <a aria-label="Facebook" className="hover:text-white" href="#">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a aria-label="Instagram" className="hover:text-white" href="#">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-r from-[#0f3a8a] via-[#0066ff] to-[#7fb7ff] rounded-3xl p-6 text-white">
            <h2 className="font-extrabold text-xl mb-4 select-none">Contact Info</h2>
            <div className="flex items-center mb-3 space-x-3 text-base">
              <FontAwesomeIcon icon={faPhoneAlt} />
              <span>+62 123-456-789</span>
              <span>Daffa Harikhsan</span>
            </div>
            <div className="flex items-center space-x-3 text-base">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>SkyNoteGACOR@gmail.com</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs font-extrabold py-6 select-none w-full mt-7">
        Copyright 2025
        <span className="inline-block border border-black rounded-full px-1.5 py-0.5 align-middle mx-1">
          ©
        </span>
        2025 SkyNotes Group. All Right Reserved
      </footer>
    </main>
  );
}
