import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';

export default function ClientDashboard() {
  const [d, setD] = useState({ bookings: [], loading: true, error: '' });
  
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await bookingService.getMyBookings();
        setD({ bookings: res.data || [], loading: false, error: '' });
      } catch (e) { setD({ bookings: [], loading: false, error: 'Failed' }); }
    };
    fetch();
  }, []);

  if (d.loading) return <ClientLayout title="..."><div className="h-96 flex items-center justify-center animate-pulse">Loading...</div></ClientLayout>;

  const stats = [
    { l: 'Total Requests', v: d.bookings.length, i: '📸', c: 'text-[#6366F1]' },
    { l: 'Approved', v: d.bookings.filter(b=>b.status==='confirmed').length, i: '✓', c: 'text-[#10B981]' },
    { l: 'Pending', v: d.bookings.filter(b=>b.status==='pending').length, i: '⏳', c: 'text-[#F59E0B]' }
  ];

  return (
    <ClientLayout title="Command Center" fullHero={true}>
      <div className="space-y-8 animate-fadeIn">
        <div className="relative overflow-hidden rounded-[2rem] p-12 bg-[#1E293B] text-white min-h-[250px] flex items-center">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"><source src="https://cdn.coverr.co/videos/coverr-looking-at-a-camera-lens-4171/1080p.mp4" type="video/mp4" /></video>
          <div className="relative z-10 max-w-xl"><p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-3">Client Registry</p><h1 className="text-4xl md:text-5xl font-serif leading-tight">Visual Story <br /><span className="text-[#E8734A]">Command Center.</span></h1></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((s,i)=>(<div key={i} className="bg-white rounded-2xl p-6 border shadow-sm group"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">{s.i}</div><p className="text-[10px] font-bold text-[#94A3B8] uppercase">{s.l}</p></div><p className={`text-4xl font-bold ${s.c}`}>{s.v}</p></div>))}
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Link to="/client/Packages" className="bg-white p-6 rounded-2xl border flex items-center gap-5 hover:shadow-md transition"><div className="text-2xl">✨</div><div><h3 className="font-bold text-sm">New Package</h3><p className="text-[10px] text-gray-400 uppercase">Browse Collections</p></div></Link>
          <Link to="/client/Portfolio" className="bg-white p-6 rounded-2xl border flex items-center gap-5 hover:shadow-md transition"><div className="text-2xl">🎨</div><div><h3 className="font-bold text-sm">View Gallery</h3><p className="text-[10px] text-gray-400 uppercase">Masterpieces</p></div></Link>
        </div>
      </div>
    </ClientLayout>
  );
}
