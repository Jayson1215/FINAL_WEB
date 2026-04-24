import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Chatbot from '../common/Chatbot';
import NotificationBell from '../common/NotificationBell';

export default function ClientLayout({ children, title, fullHero = false, hideHero = false, fullWidth = false }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navScrolled, setNavScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
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

  const navLinks = [
    { path: '/client/home', label: 'HOME' },
    { path: '/client/Packages', label: 'PACKAGES' },
    { path: '/client/Gallery', label: 'GALLERY' },
    { path: '/client/MyBookings', label: 'MY BOOKINGS' },
  ];

  const isTransparentNav = fullHero && !navScrolled && !hideHero;

  return (
    <div className="bg-[#F3F4F6] min-h-screen selection:bg-[#E8734A] selection:text-white font-sans overflow-x-hidden text-black">
      
      {/* Navigation - Professional Consistency */}
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 px-6 md:px-12 py-5 ${isTransparentNav ? 'bg-transparent' : 'bg-white border-b border-black/10 py-4 shadow-sm'}`}>
        <div className="max-w-[92%] mx-auto flex justify-between items-center">
          <Link to="/client/home" className="group flex items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-serif text-xl transition-all shadow-lg ${isTransparentNav ? 'bg-white text-black' : 'bg-black text-white'}`}>L</div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold tracking-[0.3em] transition-colors ${isTransparentNav ? 'text-white drop-shadow-md' : 'text-black'}`}>LIGHTWORKS</span>
              <span className="text-[7px] font-bold uppercase tracking-[0.5em] text-[#E8734A]">PORTAL</span>
            </div>
          </Link>

          <div className="flex items-center gap-10">
            <div className={`hidden lg:flex gap-8 items-center border-r transition-colors pr-8 ${isTransparentNav ? 'border-white/20' : 'border-black/10'}`}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className={`text-[9px] font-bold uppercase tracking-widest transition-all ${location.pathname === link.path ? 'text-[#E8734A]' : (isTransparentNav ? 'text-white hover:text-[#E8734A] drop-shadow-md' : 'text-black hover:text-[#E8734A]')}`}>
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-6 items-center">
              <div className={isTransparentNav ? 'text-white drop-shadow-md' : 'text-black'}>
                <NotificationBell />
              </div>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shadow-sm ${isTransparentNav ? 'bg-white text-black hover:bg-[#E8734A] hover:text-white' : 'bg-black text-white hover:bg-[#E8734A]'}`}>
                  {user?.name?.charAt(0)}
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-[110]" onClick={() => setProfileOpen(false)}></div>
                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[120] py-6 border border-black/10 animate-slideUp overflow-hidden">
                      <div className="px-8 pb-4 border-b border-black/5 mb-4">
                        <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-[0.4em] mb-1">Welcome, {user?.name?.split(' ')[0]}</p>
                        <p className="text-[11px] font-bold text-black truncate">{user?.email}</p>
                      </div>
                      
                      <div className="px-4">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-4 rounded-2xl text-[9px] font-bold text-red-500 hover:bg-red-50 transition-all uppercase tracking-[0.3em] flex items-center justify-between group">
                          <span>Log Out</span>
                          <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!hideHero && (
        <section className={`relative flex items-center justify-center overflow-hidden bg-black transition-all duration-1000 ${fullHero ? 'h-[85vh]' : 'h-[35vh]'}`}>
          <div className="absolute inset-0 z-0">
            {heroVideoFailed ? (
              <img src="/images/studio-hero.png" alt="Hero" className="w-full h-full object-cover opacity-50" />
            ) : (
              <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-50" poster="/images/studio-hero.png" onError={() => setHeroVideoFailed(true)}>
                <source src="https://cdn.coverr.co/videos/coverr-looking-at-a-camera-lens-4171/1080p.mp4" type="video/mp4" />
              </video>
            )}
            <div className={`absolute inset-0 bg-gradient-to-b ${fullHero ? 'from-black/40 via-transparent to-[#F3F4F6]' : 'from-black/20 to-[#F3F4F6]'}`}></div>
          </div>
          
          <div className="relative z-10 text-center max-w-5xl px-6 space-y-4 animate-fadeIn">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E8734A] drop-shadow-lg">
              {user ? `Welcome / ${user.name.toUpperCase()}` : `Studio Experience / ${title.toUpperCase()}`}
            </p>
            <h1 className={`${fullHero ? 'text-5xl md:text-8xl' : 'text-4xl md:text-5xl'} font-serif leading-tight reveal tracking-tighter text-white drop-shadow-2xl`}>
              {title}
            </h1>
            <div className="flex justify-center reveal delay-300 pt-6">
               <div className="w-20 h-[1px] bg-[#E8734A]"></div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area - Sleek Compact Logic */}
      <section className={`bg-[#F3F4F6] relative z-20 ${hideHero ? 'pt-24' : (fullWidth ? 'py-12' : '-mt-24 pb-20')}`}>
        {fullWidth ? (
          <div className="w-full">
            {children}
          </div>
        ) : (
          <div className="max-w-[85%] mx-auto px-4 md:px-8">
            <div className={`bg-white rounded-[2rem] shadow-sm reveal border border-black/10 min-h-[40vh] ${hideHero ? 'p-8 md:p-10' : 'p-6 md:p-10'}`}>
              <div className="relative z-10">
                  {hideHero && (
                    <div className="mb-8 border-b border-black/5 pb-6 flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Directory / {title}</p>
                        <h1 className="text-3xl font-serif text-black tracking-tight">{title}</h1>
                      </div>
                    </div>
                  )}
                  {children}
              </div>
            </div>
          </div>
        )}
      </section>

      <Chatbot />

      {/* Footer - Sleek Minimalist Manifest */}
      <footer className="bg-white py-12 px-6 md:px-12 border-t border-black/10">
        <div className="max-w-[92%] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="text-xl font-bold text-black tracking-[0.4em] uppercase">Lightworks</Link>
            <p className="text-[11px] text-black leading-relaxed max-w-sm font-medium italic">"A premium photography service dedicated to visual storytelling."</p>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Directory</p>
            <div className="space-y-2 text-[9px] text-black font-bold uppercase tracking-widest">
              {navLinks.map(l => (
                <Link key={l.path} to={l.path} className="block hover:text-[#E8734A] transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Concierge</p>
            <p className="text-[9px] text-black font-bold tracking-widest uppercase leading-relaxed">Butuan City / HQ<br/>concierge@light.com</p>
          </div>
        </div>
        <div className="max-w-[92%] mx-auto mt-12 pt-6 border-t border-black/5 text-center">
            <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-black/40">© {new Date().getFullYear()} LIGHT STUDIO EXPERIENCE / ART DIRECTION BY ANTIGRAVITY</p>
        </div>
      </footer>

      {/* Removed Logout Modal - Now Dropdown */}

      <style>{`
        .reveal { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.2, 1, 0.3, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
