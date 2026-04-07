import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { serviceService } from '../services/serviceService';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [dbServices, setDbServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const { user } = useAuth();
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
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceService.getServices();
      setDbServices(response.data || []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setDbServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleBookNow = (serviceId, serviceName) => {
    if (user) {
      navigate(`/client/booking/${serviceId}`);
    } else {
      localStorage.setItem('bookingIntent', JSON.stringify({
        serviceId,
        serviceName,
        timestamp: Date.now()
      }));
      navigate('/register?redirect=booking');
    }
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen selection:bg-[#C79F68] selection:text-white">

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-12 py-8 ${navScrolled ? 'bg-white/80 backdrop-blur-md py-6 border-b border-[#EEEEEE]' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex gap-10 items-center">
            <a href="#about" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] hover:text-[#C79F68] transition">About</a>
            <a href="#services" className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] hover:text-[#C79F68] transition">Services</a>
          </div>

          <Link to="/" className="text-3xl font-serif text-[#333] tracking-[0.15em] hover:text-[#C79F68] transition-colors duration-500">
            L I G H T
          </Link>

          <div className="flex gap-8 items-center">
            <Link to="/client/portfolio" className="hidden md:block text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] hover:text-[#C79F68] transition">Gallery</Link>
            {user ? (
               <Link to={user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'} className="bg-[#333] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C79F68] transition duration-500">
                 Dashboard
               </Link>
            ) : (
                <Link to="/login" className="bg-[#333] text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#C79F68] transition duration-500">
                  Login
                </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#F9F9F9]">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60 grayscale-[0.3]"
            style={{ transform: `scale(1.05) translateY(${scrollY * 0.05}px)` }}
          >
            <source src="https://cdn.coverr.co/videos/coverr-looking-at-a-camera-lens-4171/1080p.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Subtle overlay for better text contrast */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#333] mb-8 animate-fade-in-up">Light Photography Studio</p>
          <h1 className="text-6xl md:text-8xl font-serif text-[#333] mb-12 leading-tight reveal">
            Artistry in <br /> Every Frame
          </h1>
          <div className="flex justify-center reveal delay-300">
            <Link to="/register" className="bg-[#333] text-white py-6 px-12 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#C79F68] transition duration-700 shadow-premium">
              Book Your Session
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 reveal delay-1000">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#777]">Scroll</span>
            <div className="w-[1px] h-12 bg-[#333] opacity-20"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 px-12 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-24 items-center">
          <div className="w-full md:w-1/2 reveal">
            <div className="relative">
                <img
                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop"
                    alt="Photographer at work"
                    className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 shadow-premium"
                />
                <div className="absolute -bottom-8 -right-8 bg-[#F9F9F9] p-12 hidden lg:block">
                    <p className="text-3xl font-serif text-[#333] mb-2">15+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA]">Years of Vision</p>
                </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 reveal delay-300">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-6">About Our Studio</p>
            <h2 className="text-4xl font-serif text-[#333] mb-8 leading-tight">We Capture the <br /> Poetry of Reality</h2>
            <p className="text-sm text-[#777] leading-[2] mb-12 max-w-md">
              At LIGHT Studio, we believe every moment is unique. Our mission is to preserve the subtle emotions and raw beauty of life through high-end photography that stands the test of time.
            </p>
            <Link to="/client/portfolio" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333] border-b border-[#333] pb-1 hover:text-[#C79F68] hover:border-[#C79F68] transition duration-500">
                Explore the Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-40 px-12 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-6">Curated Packages</p>
            <h2 className="text-4xl font-serif text-[#333]">Our Professional Services</h2>
            <div className="w-12 h-px bg-[#C79F68] mx-auto mt-8 opacity-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loadingServices ? (
                Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white p-12 h-[400px] animate-pulse border border-[#EEEEEE]"></div>
                ))
            ) : dbServices.map((service, index) => (
              <div
                key={service.id}
                className="bg-white border border-[#EEEEEE] p-12 transition-all duration-700 hover:shadow-premium group flex flex-col reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8 group-hover:text-[#C79F68] transition">
                    {service.category || 'Package'}
                </p>
                <h3 className="text-2xl font-serif text-[#333] mb-8">{service.name}</h3>

                {/* Service Image Preview */}
                <div className="w-full aspect-[16/9] mb-10 bg-[#F9F9F9] overflow-hidden border border-[#EEEEEE] relative">
                  {service.image_path ? (
                    <img 
                      src={`http://localhost:8000/${service.image_path}`} 
                      alt={service.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <span className="text-2xl">📸</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-[#777] mb-12 line-clamp-3 leading-relaxed flex-grow">
                    {service.description}
                </p>
                
                <div className="flex justify-between items-center mb-10 pt-8 border-t border-[#EEEEEE]">
                  <span className="text-3xl font-serif text-[#333]">₱{parseFloat(service.price).toLocaleString()}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAA]">{service.duration} MIN</span>
                </div>
                
                <button
                  onClick={() => handleBookNow(service.id, service.name)}
                  className="w-full bg-[#333] text-white py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#C79F68] transition duration-500 shadow-sm"
                >
                  Reserve Session
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="py-40 bg-[#333] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-[#C79F68] mb-10">Start Your Story</p>
            <h2 className="text-5xl md:text-6xl font-serif mb-12 leading-tight">Ready to Capture Memories?</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
                <Link to="/register" className="bg-[#C79F68] text-white py-6 px-12 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-[#333] transition duration-700">
                    Get Started Today
                </Link>
                <Link to="/client/portfolio" className="text-[11px] font-bold uppercase tracking-[0.3em] hover:text-[#C79F68] transition">
                    View Recent Work →
                </Link>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-32 px-12 border-t border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-24">
          <div className="flex flex-col max-w-xs">
            <p className="text-2xl font-serif text-[#333] mb-8 tracking-widest">L I G H T</p>
            <p className="text-sm text-[#777] leading-relaxed mb-8">
              A boutique photography studio specializing in high-end visuals and authentic storytelling.
            </p>
            <div className="flex gap-6">
                <a href="#" className="text-[#333] hover:text-[#C79F68] transition text-[10px] font-bold uppercase">IG</a>
                <a href="#" className="text-[#333] hover:text-[#C79F68] transition text-[10px] font-bold uppercase">FB</a>
                <a href="#" className="text-[#333] hover:text-[#C79F68] transition text-[10px] font-bold uppercase">PT</a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-10">Studio</p>
              <div className="space-y-4 text-sm text-[#777]">
                <p>Butuan City, Agusan Del Norte</p>
                <p>Mon – Sat / 9:00 – 18:00</p>
                <p>jayson@lightstudio.com</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-10">Newsletter</p>
              <div className="flex border-b border-[#333] pb-2">
                <input type="email" placeholder="Email Address" className="bg-transparent text-sm w-full outline-none" />
                <button className="text-[10px] font-bold uppercase tracking-widest hover:text-[#C79F68] transition">Join</button>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-[#EEEEEE] flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA]">© {new Date().getFullYear()} LIGHT STUDIO</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA]">DEVELOPED BY JAYSON</p>
        </div>
      </footer>

      {/* Global Transition Styles */}
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.5s ease forwards;
        }
        .delay-300 { transition-delay: 300ms; }
        .delay-1000 { transition-delay: 1000ms; }
      `}</style>
    </div>
  );
}
