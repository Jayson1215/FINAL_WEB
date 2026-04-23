import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { serviceService } from '../services/serviceService';
import { bookingService } from '../services/bookingService';
import { portfolioService } from '../services/portfolioService';
import Chatbot from '../components/common/Chatbot';
import NotificationBell from '../components/common/NotificationBell';
import { resolveServiceImageUrl } from '../utils/imageUrl';

export default function Landing() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { search } = useLocation();
  const [data, setData] = useState({ s: [], b: [], p: [], loading: true });
  const [ui, setUi] = useState({ scrolled: false, booking: null, galleryItem: null, loginModal: false, registerModal: false });
  const [form, setForm] = useState({ date: '', time: '', loc: '', note: '', sub: false, err: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '', sub: false, err: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', conf: '', sub: false, err: '' });
  const { login, register } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, b, p] = await Promise.all([
          serviceService.getServices(),
          user?.role === 'client' ? bookingService.getMyBookings() : { data: [] },
          portfolioService.getPortfolio()
        ]);
        setData({ s: s.data || [], b: b.data || [], p: p.data || [], loading: false });
      } catch (e) { setData(p => ({ ...p, loading: false })); }
    };
    fetch();

    const h = () => setUi(p => ({ ...p, scrolled: window.scrollY > 80 }));
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, [user]);

  // Separate Effect for Animations - Runs when loading finishes
  useEffect(() => {
    if (data.loading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [data.loading]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginForm(p => ({ ...p, sub: true, err: '' }));
    try {
      const u = await login(loginForm.email, loginForm.password);
      setUi(p => ({ ...p, loginModal: false }));
      nav(u.role === 'admin' ? '/admin/dashboard' : '/client/home');
    } catch (err) { setLoginForm(p => ({ ...p, sub: false, err: err.response?.data?.message || 'Invalid Credentials' })); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.conf) return setRegForm(p => ({ ...p, err: 'Passwords do not match' }));
    setRegForm(p => ({ ...p, sub: true, err: '' }));
    try {
      const u = await register(regForm.name, regForm.email, regForm.password, regForm.conf, 'client');
      setUi(p => ({ ...p, registerModal: false }));
      nav(u.role === 'admin' ? '/admin/dashboard' : '/client/home');
    } catch (err) { setRegForm(p => ({ ...p, sub: false, err: err.response?.data?.message || 'Registration failed' })); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setForm(p => ({ ...p, sub: true, err: '' }));
    try {
      const res = await bookingService.createBooking({
        service_id: ui.booking.id, booking_date: form.date, booking_time: form.time,
        location: form.loc, special_requests: form.note, total_amount: ui.booking.price
      });
      setData(p => ({ ...p, b: [res.data, ...p.b] }));
      setUi(p => ({ ...p, booking: null }));
      nav(`/client/MyBookings?booking=${res.data.id}`);
    } catch (err) { setForm(p => ({ ...p, sub: false, err: 'Failed' })); }
  };

  const formatDur = (m) => {
    const h = Math.floor(m / 60);
    const mins = m % 60;
    return `${h}:${mins.toString().padStart(2, '0')} hours`;
  };

  if (data.loading) return <div className="h-screen flex items-center justify-center animate-pulse font-serif italic text-[#1E293B]">Loading Lightworks...</div>;

  return (
    <div className="bg-[#F0F2F5] min-h-screen font-sans selection:bg-[#E8734A] selection:text-white">
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 px-6 py-5 ${ui.scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E293B] text-white flex items-center justify-center rounded-xl font-serif text-xl group-hover:bg-[#E8734A] transition-all duration-500">L</div>
            <div className="flex flex-col">
              <span className="text-sm font-serif tracking-[0.3em] font-bold text-[#1E293B]">LIGHTWORKS</span>
              <span className="text-[7px] font-bold uppercase tracking-[0.5em] text-[#E8734A]">PRODUCTION</span>
            </div>
          </Link>

          {/* Navigation Section */}
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex gap-8 items-center border-r border-gray-200 pr-8">
              <a href="#" className="text-[9px] font-bold uppercase tracking-widest text-[#1E293B] hover:text-[#E8734A] transition-colors">Home</a>
              <a href="#about" className="text-[9px] font-bold uppercase tracking-widest text-[#1E293B] hover:text-[#E8734A] transition-colors">About Us</a>
              <a href="#services" className="text-[9px] font-bold uppercase tracking-widest text-[#1E293B] hover:text-[#E8734A] transition-colors">Packages</a>
              <a href="#gallery" className="text-[9px] font-bold uppercase tracking-widest text-[#1E293B] hover:text-[#E8734A] transition-colors">Gallery</a>
              <a href="#contact" className="text-[9px] font-bold uppercase tracking-widest text-[#1E293B] hover:text-[#E8734A] transition-colors">Contact</a>
            </div>
            <div className="flex gap-4 items-center">
              {user ? (
                <><NotificationBell /><button onClick={logout} className="bg-[#1E293B] text-white px-6 py-2 rounded-xl text-[9px] font-bold uppercase hover:bg-[#E8734A] transition-all">Logout</button></>
              ) : (
                <button onClick={() => setUi(p => ({ ...p, loginModal: true }))} className="bg-[#1E293B] text-white px-6 py-2 rounded-xl text-[9px] font-bold uppercase hover:bg-[#E8734A] transition-all shadow-sm">Join</button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="h-[85vh] flex items-center justify-center bg-white relative">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-60"><source src="https://cdn.coverr.co/videos/coverr-looking-at-a-camera-lens-4171/1080p.mp4" type="video/mp4" /></video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F0F2F5]"></div>
        <div className="relative text-center space-y-6 px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Registry & Management</p>
          <h1 className="text-5xl md:text-8xl font-serif text-[#1E293B] leading-none tracking-tighter">Capturing Life <br /><span className="text-[#E8734A]">At Your Place.</span></h1>
          <a href="#services" className="inline-block bg-[#1E293B] text-white py-4 px-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-xl">EXPLORE SERVICES</a>
        </div>
      </section>

      <section id="services" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-20 reveal">
        <div className="text-center mb-20 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8734A]">Collections</p>
          <h2 className="text-4xl font-serif text-[#1E293B]">Signature Packages</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.s.map(s => (
            <div key={s.id} onClick={() => setUi(p => ({ ...p, booking: s }))} className="bg-white rounded-[2rem] p-4 border hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <img src={resolveServiceImageUrl(s)} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest text-[#1E293B] shadow-sm">{s.category}</div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-[#1E293B]">{s.name}</h3>
                  <p className="text-[10px] font-bold text-[#1E293B]/60 uppercase">{formatDur(s.duration)}</p>
                </div>
                <p className="text-[10px] text-[#1E293B] font-medium italic mb-6 line-clamp-2 leading-relaxed">"{s.description}"</p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                  <p className="text-lg font-bold text-[#1E293B]">₱{parseFloat(s.price).toLocaleString()}</p>
                  <button className="bg-[#1E293B] text-white px-6 py-2.5 rounded-xl text-[8px] font-bold uppercase tracking-widest group-hover:bg-[#E8734A] transition-all">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="py-32 bg-white scroll-mt-20 reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8734A]">Gallery</p>
              <h2 className="text-4xl font-serif text-[#1E293B]">Masterpieces</h2>
            </div>
            <Link to="/client/Portfolio" className="text-[9px] font-bold uppercase tracking-widest border-b-2 border-[#E8734A] pb-1">View Full Gallery</Link>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {data.p.slice(0, 6).map(item => (
              <div key={item.id} onClick={() => setUi(p => ({ ...p, galleryItem: item }))} className="relative rounded-[2rem] overflow-hidden group cursor-pointer">
                <img src={item.image_url} alt={item.title} className="w-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                  <p className="text-[9px] font-bold text-[#E8734A] uppercase tracking-widest mb-1">{item.category}</p>
                  <h4 className="text-white font-serif text-lg">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {ui.galleryItem && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-2xl z-[400] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setUi(p => ({ ...p, galleryItem: null }))}>
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center bg-white/40 backdrop-blur-md p-8 md:p-16 rounded-[3rem] border border-white/50 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
              <img src={ui.galleryItem.image_url} alt={ui.galleryItem.title} className="w-full h-auto max-h-[70vh] object-contain" />
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">{ui.galleryItem.category}</p>
                <h2 className="text-5xl font-serif text-[#1E293B] leading-tight">{ui.galleryItem.title}</h2>
              </div>
              <p className="text-sm text-[#1E293B]/70 italic leading-relaxed font-medium">"{ui.galleryItem.description || 'A captured moment of pure authenticity and light.'}"</p>
              <div className="pt-10">
                <button onClick={() => setUi(p => ({ ...p, galleryItem: null }))} className="bg-[#1E293B] text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-xl">Close Gallery</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="about" className="py-32 px-6 max-w-7xl mx-auto scroll-mt-20 reveal">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8734A]">The Studio</p>
            <h2 className="text-5xl font-serif text-[#1E293B] leading-tight">We Believe in <br />Timeless Visuals.</h2>
            <p className="text-[#1E293B] font-medium leading-relaxed max-w-md">LIGHT Studio Experience is dedicated to capturing the raw, authentic moments of your life. Based in Butuan City, we specialize in high-end editorial photography that tells a story beyond the lens.</p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div><p className="text-3xl font-serif text-[#1E293B]">500+</p><p className="text-[8px] font-bold text-[#1E293B]/60 uppercase tracking-widest">Sessions</p></div>
              <div><p className="text-3xl font-serif text-[#1E293B]">100%</p><p className="text-[8px] font-bold text-[#1E293B]/60 uppercase tracking-widest">Satisfaction</p></div>
            </div>
          </div>
          <div className="bg-[#1E293B] h-[600px] rounded-[3rem] overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" className="w-full h-full object-cover opacity-80" alt="Studio" />
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 bg-[#1E293B] text-white scroll-mt-20 reveal">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#E8734A]">Contact</p>
              <h2 className="text-5xl font-serif leading-tight">Let's Create <br />Something Iconic.</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">📍</div>
                <div><p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Studio Location</p><p className="text-sm text-white">Main St, Butuan City, Philippines</p></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">✉️</div>
                <div><p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Email Us</p><p className="text-sm text-white">hello@lightstudio.com</p></div>
              </div>
            </div>
          </div>
          <form className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <input type="text" placeholder="First Name" className="w-full bg-white/10 p-4 rounded-xl text-xs outline-none focus:bg-white/20 transition-all" />
              <input type="text" placeholder="Last Name" className="w-full bg-white/10 p-4 rounded-xl text-xs outline-none focus:bg-white/20 transition-all" />
            </div>
            <input type="email" placeholder="Email Address" className="w-full bg-white/10 p-4 rounded-xl text-xs outline-none focus:bg-white/20 transition-all" />
            <textarea placeholder="Your Message" className="w-full bg-white/10 p-4 rounded-xl text-xs h-32 outline-none focus:bg-white/20 transition-all" />
            <button className="w-full bg-[#E8734A] py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#FB923C] transition-all">Send Inquiry</button>
          </form>
        </div>
      </section>

      {ui.booking && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-3xl z-[400] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setUi(p => ({ ...p, booking: null }))}>
          <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] p-12 max-w-2xl w-full relative shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] border border-white/40 overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1E293B] via-[#E8734A] to-[#1E293B]"></div>
            <h2 className="text-4xl font-serif mb-10 text-[#1E293B] text-center">Reserve {ui.booking.name}</h2>
            <form onSubmit={handleBook} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2"><p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Session Date</p><input type="date" required className="w-full bg-white/50 backdrop-blur-sm p-4 rounded-2xl text-xs border border-white/20 text-[#1E293B] font-bold focus:bg-white transition-all outline-none" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                <div className="space-y-2"><p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Session Time</p><input type="time" required className="w-full bg-white/50 backdrop-blur-sm p-4 rounded-2xl text-xs border border-white/20 text-[#1E293B] font-bold focus:bg-white transition-all outline-none" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Location</p><input type="text" placeholder="Venue Location" required className="w-full bg-white/50 backdrop-blur-sm p-4 rounded-2xl text-xs border border-white/20 text-[#1E293B] font-bold focus:bg-white transition-all outline-none" value={form.loc} onChange={e => setForm({ ...form, loc: e.target.value })} /></div>
              <div className="space-y-2"><p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Additional Notes</p><textarea placeholder="Special Requests" className="w-full bg-white/50 backdrop-blur-sm p-4 rounded-2xl text-xs h-28 border border-white/20 text-[#1E293B] font-bold focus:bg-white transition-all outline-none" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} /></div>
              <button type="submit" disabled={form.sub} className="w-full bg-[#1E293B] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-xl mt-4">{form.sub ? 'Syncing...' : 'Confirm Request'}</button>
            </form>
          </div>
        </div>
      )}

      <footer className="py-24 text-center border-t bg-white">
        <Link to="/" className="text-2xl font-serif tracking-widest text-[#1E293B]">LIGHT</Link>
        <p className="text-[8px] font-bold text-[#1E293B]/60 uppercase tracking-widest mt-6">© {new Date().getFullYear()} LIGHT STUDIO EXPERIENCE • ART DIRECTION BY ANTIGRAVITY</p>
      </footer>
      {ui.loginModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-3xl z-[500] flex items-center justify-center p-6 animate-fadeIn overflow-y-auto">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] max-w-lg w-full relative shadow-2xl border border-white/50 overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="p-12">
              <div className="mb-10 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-4">Access Portal</p>
                <h3 className="text-4xl font-serif text-[#1E293B]">Welcome Back</h3>
                <p className="text-[10px] font-bold text-[#1E293B]/60 uppercase tracking-widest mt-2">Enter credentials to proceed</p>
              </div>
              {loginForm.err && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[9px] font-bold uppercase tracking-widest border border-red-100">{loginForm.err}</div>}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Email Address</p>
                  <input type="email" required className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold outline-none focus:bg-white focus:border-[#E8734A] transition-all" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Password</p>
                  <input type="password" required className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold outline-none focus:bg-white focus:border-[#E8734A] transition-all" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                </div>
                <button type="submit" disabled={loginForm.sub} className="w-full bg-[#1E293B] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-xl">{loginForm.sub ? 'Authenticating...' : 'Access Portal'}</button>
              </form>
              <div className="mt-8 flex flex-col items-center gap-6">
                <div className="relative w-full flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-gray-200"></div></div>
                  <span className="relative px-4 bg-white/40 backdrop-blur-sm text-[8px] font-bold uppercase tracking-widest text-[#1E293B]">Social Access</span>
                </div>
                <button onClick={() => {
                  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                  window.location.href = `${apiBase.endsWith('/') ? apiBase.slice(0,-1) : apiBase}/auth/google/redirect`;
                }} className="w-full flex items-center justify-center gap-3 bg-white/60 border border-gray-300 py-4 rounded-2xl hover:bg-white transition-all group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#1E293B]">Continue with Google</span>
                </button>
                <div className="text-center">
                  <p className="text-[9px] font-bold text-[#1E293B]/60 uppercase tracking-widest">Don't have an account?</p>
                  <button onClick={() => setUi(p => ({ ...p, loginModal: false, registerModal: true }))} className="mt-4 text-[9px] font-bold uppercase tracking-widest border-b border-[#E8734A] pb-1">Create Profile</button>
                </div>
              </div>
            </div>
            <button onClick={() => setUi(p => ({ ...p, loginModal: false }))} className="absolute top-8 right-8 text-2xl text-[#1E293B]/40 hover:text-[#1E293B] transition-colors">×</button>
          </div>
        </div>
      )}
      {ui.registerModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-3xl z-[500] flex items-center justify-center p-6 animate-fadeIn overflow-y-auto">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] max-w-lg w-full relative shadow-2xl border border-white/50 overflow-hidden animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="p-12">
              <div className="mb-10 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-4">Join Community</p>
                <h3 className="text-4xl font-serif text-[#1E293B]">Create Account</h3>
                <p className="text-[10px] font-bold text-[#1E293B]/60 uppercase tracking-widest mt-2">Become a member today</p>
              </div>
              {regForm.err && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[9px] font-bold uppercase tracking-widest border border-red-100">{regForm.err}</div>}
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Full Name</p>
                  <input type="text" required className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold outline-none focus:bg-white focus:border-[#E8734A] transition-all" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Email Address</p>
                  <input type="email" required className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold outline-none focus:bg-white focus:border-[#E8734A] transition-all" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Password</p>
                    <input type="password" required className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold outline-none focus:bg-white focus:border-[#E8734A] transition-all" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Confirm</p>
                    <input type="password" required className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold outline-none focus:bg-white focus:border-[#E8734A] transition-all" value={regForm.conf} onChange={e => setRegForm({...regForm, conf: e.target.value})} />
                  </div>
                </div>
                <button type="submit" disabled={regForm.sub} className="w-full bg-[#1E293B] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-xl mt-2">{regForm.sub ? 'Creating Account...' : 'Start Your Journey'}</button>
              </form>
              <div className="mt-8 text-center">
                <p className="text-[9px] font-bold text-[#1E293B]/60 uppercase tracking-widest">Already a member?</p>
                <button onClick={() => setUi(p => ({ ...p, registerModal: false, loginModal: true }))} className="mt-4 text-[9px] font-bold uppercase tracking-widest border-b border-[#E8734A] pb-1">Sign In to Account</button>
              </div>
            </div>
            <button onClick={() => setUi(p => ({ ...p, registerModal: false }))} className="absolute top-8 right-8 text-2xl text-[#1E293B]/40 hover:text-[#1E293B] transition-colors">×</button>
          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
}
