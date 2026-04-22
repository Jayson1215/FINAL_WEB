import React, { useState } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you'd send this to your backend
  };

  return (
    <ClientLayout title="Connect With Us">
      <div className="max-w-5xl mx-auto animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-4">Get In Touch</p>
              <h2 className="text-4xl font-serif text-[#1E293B] mb-6">Masterful Vision, <br />Delivered Anywhere.</h2>
              <p className="text-[#64748B] text-sm leading-relaxed max-w-sm italic font-medium">
                "We are an on-call photography service dedicated to capturing your most precious moments at your chosen location. Reach out for custom quotes or specific inquiries."
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center text-xl group-hover:bg-[#E8734A] group-hover:text-white transition-all duration-500">📍</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Service Area</p>
                  <p className="text-sm font-bold text-[#1E293B]">Butuan City & Surrounding Regions</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center text-xl group-hover:bg-[#E8734A] group-hover:text-white transition-all duration-500">✉️</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Inquiries</p>
                  <p className="text-sm font-bold text-[#1E293B]">concierge@lightphotography.com</p>
                </div>
              </div>
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center text-xl group-hover:bg-[#E8734A] group-hover:text-white transition-all duration-500">🕒</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Business Hours</p>
                  <p className="text-sm font-bold text-[#1E293B]">Mon – Sat / 9:00 – 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2.5rem] shadow-premium border border-[#F1F5F9] p-8 md:p-12 relative overflow-hidden">
            {submitted ? (
              <div className="text-center py-16 space-y-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">✓</div>
                <h3 className="text-2xl font-serif text-[#1E293B]">Message Received</h3>
                <p className="text-sm text-[#64748B] italic">"Our concierge team will reach out to you within 24 hours."</p>
                <button onClick={() => setSubmitted(false)} className="text-[10px] font-bold uppercase tracking-widest text-[#E8734A] border-b border-[#E8734A] pb-1 hover:opacity-70 transition">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Name</label>
                    <input type="text" required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-sm focus:border-[#E8734A] outline-none transition" placeholder="Your Full Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Email</label>
                    <input type="email" required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-sm focus:border-[#E8734A] outline-none transition" placeholder="email@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Subject</label>
                  <input type="text" required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-sm focus:border-[#E8734A] outline-none transition" placeholder="Booking Inquiry, Feedback, etc." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Message</label>
                  <textarea rows={5} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-sm focus:border-[#E8734A] outline-none transition resize-none" placeholder="Tell us about your event or vision..."></textarea>
                </div>
                <button type="submit" className="w-full bg-[#1E293B] text-white py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] hover:shadow-xl hover:translate-y-[-2px] transition-all duration-500 shadow-lg">
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
