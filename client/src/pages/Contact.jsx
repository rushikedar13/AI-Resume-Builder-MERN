import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [sent, setSent] = useState(false);

 
  const handleSubmit = (e) => {
  e.preventDefault();

  // Admin mail
  emailjs.sendForm(
    "service_e2gcocp",
    "template_bipj6zg",
    e.target,
    "zh4vS30XsA-Yqq19D"
  );

  // User auto reply
  emailjs.sendForm(
    "service_e2gcocp",
    "template_kgyjxff",
    e.target,
    "zh4vS30XsA-Yqq19D"
  );

  setSent(true);
  e.target.reset();
};

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[#FCFAF2] px-6 py-24">

        <div className="max-w-6xl mx-auto">

          <h1 className="text-6xl font-black text-center mb-16">
            Contact <span className="text-emerald-700">Us</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-16">

            {/* Contact Info */}
            <div className="space-y-10">

              <div className="flex items-center gap-4">
                <Mail className="text-emerald-700" />
                <p>supportresumeai@gmail.com</p>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-emerald-700" />
                <p>+91 84858 63058</p>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="text-emerald-700" />
                <p>Amravati, Maharashtra</p>
              </div>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-10 rounded-xl shadow-lg space-y-6"
            >

              <input
                name="user_name"
                type="text"
                placeholder="Your Name"
                required
                className="w-full border px-4 py-3 rounded-lg"
              />

              <input
                name="user_email"
                type="email"
                placeholder="Email Address"
                required
                className="w-full border px-4 py-3 rounded-lg"
              />

              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                required
                className="w-full border px-4 py-3 rounded-lg"
              />

              <button
                type="submit"
                className="flex items-center gap-2 bg-emerald-700 text-white px-8 py-3 rounded-lg"
              >
                Send Message
                <Send size={16} />
              </button>

              {sent && (
                <p className="text-emerald-700 font-bold">
                  ✅ Email sent successfully!
                </p>
              )}

            </form>

          </div>

        </div>
      </div>
    </>
  );
};

export default Contact;