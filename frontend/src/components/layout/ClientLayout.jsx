import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Chatbot from '../common/Chatbot';
import NotificationBell from '../common/NotificationBell';

export default function ClientLayout({ children, title, fullHero = false }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navScrolled, setNavScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);

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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [children]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen selection:bg-[#E8734A] selection:text-white font-sans overflow-x-hidden">
      
      {/* Navigation - Perfectly Centered Grid (3-column) */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 py-6 ${navScrolled || !fullHero ? 'bg-white/80 backdrop-blur-xl py-4 border-b border-[#F1F5F9] shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          
          {/* Left Side Links */}
          <div className="hidden lg:flex gap-8 items-center justify-start">
            <Link to="/client/homepage" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/homepage' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>Homepage</Link>
            <Link to="/client/Portfolio" className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/Portfolio' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>Portfolio</Link>
            <Link to="/client/Packages" className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/Packages' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>Package</Link>
            <Link to="/client/Gallery" className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/Gallery' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>Gallery</Link>
          </div>

          <div className="flex justify-center">
            <Link to="/client/homepage" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-3xl font-serif text-[#1E293B] tracking-[0.2em] hover:text-[#E8734A] transition-all duration-500">
              LIGHT
            </Link>
          </div>

          {/* Right Side Links */}
          <div className="flex gap-6 md:gap-8 items-center justify-end">
             <Link to="/client/MyBookings" className={`hidden lg:block text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/MyBookings' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>My Bookings</Link>
             <Link to="/client/contact" className={`hidden sm:block text-[10px] font-bold uppercase tracking-[0.3em] transition-all ${location.pathname === '/client/contact' ? 'text-[#E8734A]' : 'text-[#1E293B] hover:text-[#E8734A]'}`}>Contact</Link>
             <NotificationBell />
             <button onClick={() => setShowLogoutModal(true)} className="bg-[#1E293B] text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] hover:shadow-lg transition-all duration-500 whitespace-nowrap">
               Logout
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative flex items-center justify-center overflow-hidden bg-white transition-all duration-1000 ${fullHero ? 'h-[65vh]' : 'h-[35vh]'}`}>
        <div className="absolute inset-0 z-0">
          {heroVideoFailed ? (
            <img 
              src="/images/studio-hero.png" 
              alt="Hero Background" 
              className="w-full h-full object-cover opacity-80"
              style={{ transform: `scale(1.05) translateY(${scrollY * 0.1}px)` }}
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-80"
              style={{ transform: `scale(1.05) translateY(${scrollY * 0.1}px)` }}
              poster="/images/studio-hero.png"
              onError={() => setHeroVideoFailed(true)}
            >
              <source src="https://cdn.coverr.co/videos/coverr-looking-at-a-camera-lens-4171/1080p.mp4" type="video/mp4" />
            </video>
          )}
          <div className={`absolute inset-0 bg-gradient-to-b from-white/40 ${fullHero ? 'via-white/10 to-[#F0F2F5]' : 'via-white/60 to-[#F0F2F5]'}`}></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl px-6 space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] animate-fadeIn">
            {user ? `WELCOME BACK, ${user.name.toUpperCase()}` : (fullHero ? 'Registry & Management' : 'Registry Explorer')}
          </p>
          <h1 className={`${fullHero ? 'text-5xl md:text-8xl' : 'text-4xl md:text-6xl'} font-serif leading-tight reveal tracking-tight`}>
            {title === "Manage Your Visual Story." ? (
              <>
                <span className="text-[#1E293B]">Manage Your</span> <br />
                <span className="text-[#E8734A]">Visual Story.</span>
              </>
            ) : (
              <span className="text-[#1E293B]">{title}</span>
            )}
          </h1>
          <div className="flex justify-center reveal delay-300 pt-4">
             <div className="w-16 h-1 bg-gradient-to-r from-[#E8734A] to-[#FB923C] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Main Content - Styled as a Homepage Section */}
      <section className="py-24 md:py-48 px-6 md:px-12 bg-[#F0F2F5] relative -mt-32 z-20">
        <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-premium p-8 md:p-20 reveal border border-[#F1F5F9]">
           <div className="relative z-10">
              {children}
           </div>
        </div>
      </section>

      <Chatbot />

      {/* Footer */}
      <footer className="bg-white py-32 px-6 md:px-12 border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-20">
          <div className="lg:col-span-2 space-y-10">
            <Link to="/" className="text-3xl font-serif text-[#1E293B] tracking-[0.3em]">LIGHT</Link>
            <p className="text-base text-[#64748B] leading-[1.8] max-w-sm font-medium italic">"A premium on-call photography service dedicated to the art of visual storytelling."</p>
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
        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-[#F1F5F9] text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#94A3B8]">© {new Date().getFullYear()} LIGHT STUDIO EXPERIENCE • ART DIRECTION BY ANTIGRAVITY</p>
        </div>
      </footer>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-[#1E293B]/90 backdrop-blur-xl z-[1000] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#E8734A]"></div>
            <div className="w-20 h-20 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">👋</div>
            <h3 className="text-3xl font-serif text-[#1E293B] mb-4">Ending Session?</h3>
            <p className="text-sm text-[#64748B] mb-10 font-medium italic">"We look forward to capturing more of your story soon."</p>
            <div className="flex flex-col gap-4">
              <button onClick={handleLogout} className="bg-[#1E293B] text-white py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] transition-all shadow-lg">Confirm Logout</button>
              <button onClick={() => setShowLogoutModal(false)} className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] hover:text-[#1E293B] transition-colors py-2">Stay a while</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .reveal { opacity: 0; transform: translateY(40px); transition: all 1.2s cubic-bezier(0.2, 1, 0.3, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1.5s ease-out forwards; }
        .shadow-premium { box-shadow: 0 50px 100px -20px rgba(0,0,0,0.05), 0 30px 60px -30px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
}
