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
  const [ui, setUi] = useState({ scrolled: false, booking: null });
  const [form, setForm] = useState({ date: '', time: '', loc: '', note: '', sub: false, err: '' });

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

  if (data.loading) return <div className="h-screen flex items-center justify-center animate-pulse font-serif italic">Loading Light...</div>;

  return (
    <div className="bg-[#F0F2F5] min-h-screen font-sans selection:bg-[#E8734A] selection:text-white">
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 px-6 py-5 ${ui.scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="hidden md:flex gap-8"><a href="#services" className="text-[9px] font-bold uppercase tracking-widest">Packages</a></div>
          <Link to="/" className="text-2xl font-serif tracking-widest">LIGHT</Link>
          <div className="flex gap-4 items-center">
            {user ? (<><NotificationBell /><button onClick={logout} className="bg-[#1E293B] text-white px-6 py-2 rounded-xl text-[9px] font-bold uppercase">Logout</button></>) : <Link to="/login" className="bg-[#1E293B] text-white px-6 py-2 rounded-xl text-[9px] font-bold uppercase">Join</Link>}
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

      <section id="services" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.s.map(s => (
            <div key={s.id} onClick={() => setUi(p => ({ ...p, booking: s }))} className="bg-white rounded-[2rem] p-4 border hover:shadow-2xl transition-all cursor-pointer group">
              <img src={resolveServiceImageUrl(s)} className="w-full aspect-[4/5] rounded-[1.5rem] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="p-6 space-y-2">
                <p className="text-[9px] font-bold text-[#E8734A] uppercase tracking-widest">{s.category}</p>
                <h3 className="text-xl font-serif">{s.name}</h3>
                <p className="text-xl font-bold">₱{parseFloat(s.price).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {ui.booking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[300] flex items-center justify-center p-6" onClick={() => setUi(p => ({ ...p, booking: null }))}>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full relative shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-2 bg-[#E8734A]"></div>
            <h2 className="text-3xl font-serif mb-8">Reserve {ui.booking.name}</h2>
            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="date" required className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                <input type="time" required className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
              <input type="text" placeholder="Venue Location" required className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={form.loc} onChange={e => setForm({ ...form, loc: e.target.value })} />
              <textarea placeholder="Special Requests" className="w-full bg-gray-50 p-4 rounded-xl text-xs h-24" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              <button type="submit" disabled={form.sub} className="w-full bg-[#1E293B] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">{form.sub ? 'Processing...' : 'Confirm Request'}</button>
            </form>
          </div>
        </div>
      )}

      <footer className="py-24 text-center border-t bg-white">
        <Link to="/" className="text-2xl font-serif tracking-widest">LIGHT</Link>
        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-6">© {new Date().getFullYear()} LIGHT STUDIO EXPERIENCE • ART DIRECTION BY ANTIGRAVITY</p>
      </footer>
      <Chatbot />
    </div>
  );
}
