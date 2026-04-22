import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import Chatbot from '../../components/common/Chatbot';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function ClientDashboard() {
  const [scrollY, setScrollY] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [dbServices, setDbServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setNavScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [loadingServices]);

  useEffect(() => { 
    const fetchData = async () => {
      try {
        setLoadingServices(true);
        const [servicesRes, bookingsRes] = await Promise.all([
          serviceService.getServices(),
          bookingService.getMyBookings()
        ]);
        setDbServices(servicesRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchData();
  }, []);

  const handleBookNow = (serviceId) => {
    navigate(`/client/booking/${serviceId}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const getServiceImageUrl = (imagePath) => {
    return resolveImageUrl(imagePath);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved': return { label: 'Available', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' };
      case 'awaiting_payment': return { label: 'Payment Required', bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500' };
      case 'paid': return { label: 'Confirmed & Paid', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' };
      default: return { label: 'Reviewing', bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' };
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen selection:bg-[#E8734A] selection:text-white font-sans">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 py-6 ${navScrolled ? 'bg-white/80 backdrop-blur-xl py-4 border-b border-[#F1F5F9] shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Left: Packages & Gallery */}
          <div className="hidden lg:flex gap-10 items-center justify-start">
            <a href="#services" className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1E293B] hover:text-[#E8734A] transition-all">Packages</a>
            <Link to="/client/portfolio" className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1E293B] hover:text-[#E8734A] transition-all">Gallery</Link>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <Link to="/" className="text-3xl font-serif text-[#1E293B] tracking-[0.2em] hover:text-[#E8734A] transition-all duration-500">
              LIGHT
            </Link>
          </div>

          {/* Right: Bookings, Contact, Logout */}
          <div className="flex gap-6 md:gap-8 items-center justify-end">
            <a href="#registry" className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.4em] text-[#1E293B] hover:text-[#E8734A] transition-all">My Bookings</a>
            <a href="#contact" className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.4em] text-[#1E293B] hover:text-[#E8734A] transition-all">Contact</a>
            <button onClick={handleLogout} className="bg-[#1E293B] text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] hover:shadow-lg transition-all duration-500 whitespace-nowrap">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80" style={{ transform: `scale(1.1) translateY(${scrollY * 0.1}px)` }}>
            <source src="https://cdn.coverr.co/videos/coverr-looking-at-a-camera-lens-4171/1080p.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#F0F2F5]"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl px-6 space-y-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.6em] text-[#E8734A] animate-fadeIn">Welcome back, {user?.name?.split(' ')[0]}</p>
          <h1 className="text-6xl md:text-9xl font-serif text-[#1E293B] leading-[1.1] reveal tracking-tight">
            Elevate Your <br /> <span className="text-[#E8734A]">Visual Presence.</span>
          </h1>
          <div className="flex justify-center reveal delay-300 pt-8">
            <a href="#registry" className="bg-[#1E293B] text-white py-6 px-14 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-[#E8734A] hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-700 shadow-xl">
              Access Your Registry
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 reveal delay-700">
            <div className="w-[1px] h-20 bg-gradient-to-b from-[#E8734A] to-transparent"></div>
        </div>
      </section>

      {/* My Bookings Section (Replacing About) */}
      <section id="registry" className="py-32 md:py-56 px-6 md:px-12 bg-[#F0F2F5] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/50 rounded-full blur-3xl -mr-64 -mt-64"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-28 space-y-6 reveal">
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#E8734A]">Your Sessions</p>
            <h2 className="text-5xl font-serif text-[#1E293B]">Active Registry</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#E8734A] to-[#FB923C] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {bookings.length > 0 ? bookings.map((booking, idx) => {
              const status = getStatusConfig(booking.status);
              return (
                <div key={booking.id} className="reveal bg-white rounded-[3rem] p-10 md:p-16 shadow-premium border border-[#F1F5F9] flex flex-col lg:flex-row gap-12 items-center" style={{ transitionDelay: `${idx * 100}ms` }}>
                  <div className="w-full lg:w-1/3 aspect-video lg:aspect-square rounded-[2rem] overflow-hidden bg-[#F8F9FB]">
                     <img src={getServiceImageUrl(booking.service?.image_path)} alt={booking.service?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-serif text-[#1E293B] mb-2">{booking.service?.name}</h3>
                        <p className="text-sm text-[#64748B] italic font-medium">Session on {new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${status.bg} ${status.text} flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`}></span>
                        {status.label}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">Time</p>
                          <p className="text-sm font-bold text-[#1E293B]">{booking.booking_time}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">Investment</p>
                          <p className="text-sm font-bold text-[#1E293B]">₱{parseFloat(booking.total_amount).toLocaleString()}</p>
                       </div>
                       <div className="space-y-1 col-span-2 md:col-span-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">Location</p>
                          <p className="text-sm font-bold text-[#1E293B] truncate">📍 {booking.location}</p>
                       </div>
                    </div>
                    <div className="pt-8 border-t border-[#F1F5F9] flex gap-4">
                       {booking.status === 'awaiting_payment' && (
                          <button onClick={() => navigate('/client/checkout', { state: { booking } })} className="bg-[#E8734A] text-white px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:shadow-xl transition-all animate-pulse shadow-lg">Proceed to Payment</button>
                       )}
                       <button className="bg-[#1E293B] text-white px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:shadow-xl transition-all shadow-md">Review Details</button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="reveal py-32 text-center bg-white rounded-[4rem] border border-dashed border-[#E2E8F0] shadow-sm">
                 <p className="text-lg font-serif italic text-[#94A3B8]">Your session registry is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Packages Section (Exact Copy of Homepage Services) */}
      <section id="services" className="py-32 md:py-56 px-6 md:px-12 bg-white rounded-[4rem] shadow-premium relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-28 space-y-6 reveal">
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#E8734A]">Signature Collections</p>
            <h2 className="text-5xl font-serif text-[#1E293B]">Explore Packages</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#E8734A] to-[#FB923C] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {dbServices.map((service, index) => {
              const serviceImageUrl = getServiceImageUrl(service.image_path);
              return (
              <div key={service.id} className="group bg-white border border-[#F1F5F9] rounded-[2.5rem] p-4 transition-all duration-700 hover:shadow-card-hover flex flex-col reveal" style={{ transitionDelay: `${index * 150}ms` }}>
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] mb-8 bg-[#F8F9FB]">
                  {serviceImageUrl ? (
                    <img src={serviceImageUrl} alt={service.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">📸</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                     <p className="text-white text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">Book Session</p>
                  </div>
                </div>
                
                <div className="px-6 pb-6 flex-1 flex flex-col space-y-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8734A] mb-3">{service.category || 'Portfolio'}</p>
                    <h3 className="text-2xl font-serif text-[#1E293B] group-hover:text-[#E8734A] transition-colors">{service.name}</h3>
                  </div>
                  <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2 font-medium italic">"{service.description}"</p>
                  <div className="flex justify-between items-center pt-6 border-t border-[#F1F5F9] mt-auto">
                    <span className="text-2xl font-serif font-bold text-[#1E293B]">₱{parseFloat(service.price).toLocaleString()}</span>
                    <button onClick={() => handleBookNow(service.id)} className="bg-[#1E293B] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#E8734A] transition-all duration-500 group-hover:translate-x-2 shadow-lg">
                      →
                    </button>
                  </div>
                </div>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* Contact Section (Replacing Global CTA) */}
      <section id="contact" className="py-48 bg-[#1E293B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed scale-110"></div>
        <div className="absolute inset-0 bg-[#1E293B]/60 backdrop-blur-[2px]"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 space-y-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.6em] text-[#E8734A]">Client Support</p>
            <h2 className="text-6xl md:text-8xl font-serif leading-tight">Need Assistance <br /> <span className="text-[#E8734A]">with Your Order?</span></h2>
            <div className="flex flex-col sm:flex-row justify-center gap-8 items-center pt-8">
                <a href="mailto:concierge@lightphotography.com" className="bg-[#E8734A] text-white py-6 px-16 rounded-2xl text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-[#1E293B] hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-700 shadow-xl w-full sm:w-auto">
                    Message Concierge
                </a>
                <Link to="/" className="text-[11px] font-bold uppercase tracking-[0.4em] hover:text-[#E8734A] transition-all group flex items-center gap-3">
                    Back to Home <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-32 px-6 md:px-12 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-20">
          <div className="lg:col-span-2 space-y-10">
            <Link to="/" className="text-3xl font-serif text-[#1E293B] tracking-[0.3em]">LIGHT</Link>
            <p className="text-base text-[#64748B] leading-[1.8] max-w-sm font-medium italic">
              "A premium on-call photography service dedicated to the art of visual storytelling."
            </p>
          </div>
          <div className="space-y-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Concierge</p>
            <div className="space-y-6 text-sm text-[#64748B] font-medium">
              <p>Butuan City & Surrounding Areas</p>
              <p className="text-[#1E293B] font-bold">concierge@lightphotography.com</p>
            </div>
          </div>
          <div className="space-y-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Newsletter</p>
            <p className="text-[10px] text-[#94A3B8] font-bold tracking-wider leading-relaxed uppercase">SUBSCRIBE TO RECEIVE EXCLUSIVE UPDATES.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-[#F1F5F9] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#94A3B8]">© {new Date().getFullYear()} LIGHT STUDIO EXPERIENCE</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#94A3B8]">ART DIRECTION BY ANTIGRAVITY</p>
        </div>
      </footer>

      <Chatbot />

      {/* Global Animations */}
      <style>{`
        .reveal { opacity: 0; transform: translateY(40px); transition: all 1.2s cubic-bezier(0.2, 1, 0.3, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1.5s ease-out forwards; }
        .delay-300 { transition-delay: 300ms; }
        .delay-700 { transition-delay: 700ms; }
        .delay-150 { transition-delay: 150ms; }
        .shadow-premium { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.05), 0 30px 60px -30px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
}
