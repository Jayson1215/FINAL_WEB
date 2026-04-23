import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';
import LocationPickerMap from '../../components/common/LocationPickerMap';

export default function BookingPage() {
  const { serviceId } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState({ s: null, loading: true, sub: false, err: '' });
  const [f, setF] = useState({ date: '', time: '', loc: '', note: '' });

  useEffect(() => {
    (async () => {
      try {
        const r = await serviceService.getServiceDetail(serviceId);
        setD({ s: r.data, loading: false, sub: false, err: '' });
      } catch (e) {
        setD(p => ({ ...p, loading: false, err: 'Failed to synchronize package data.' }));
      }
    })();
  }, [serviceId]);

  const submit = async (e) => {
    e.preventDefault();
    setD(p => ({ ...p, sub: true, err: '' }));
    try {
      const res = await bookingService.createBooking({
        service_id: serviceId,
        booking_date: f.date,
        booking_time: f.time,
        location: f.loc,
        special_requests: f.note,
        total_amount: d.s.price
      });
      nav(`/client/MyBookings?booking=${res.data.id}&highlight=1`);
    } catch (err) {
      setD(p => ({ ...p, sub: false, err: err.response?.data?.message || 'Transaction error.' }));
    }
  };

  if (d.loading) return (
    <ClientLayout title="Preparing Manifest..." hideHero={true}>
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black opacity-40">Syncing Masterpiece Data...</p>
      </div>
    </ClientLayout>
  );

  return (
    <ClientLayout title="Package Details" hideHero={true}>
      <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-20">
        
        {d.err && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-[8px] font-bold uppercase tracking-widest text-center">
            {d.err}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          
          {/* Package Detail Sidebar - Ultra Compact */}
          <div className="lg:col-span-2 space-y-4 sticky top-24">
            <div className="bg-white rounded-[1.5rem] p-5 border border-black/10 shadow-sm space-y-5 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
              
              <div className="space-y-2">
                <p className="text-[7px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Selection</p>
                <h2 className="text-2xl font-serif text-black leading-tight tracking-tighter">{d.s.name}</h2>
                <div className="bg-slate-50 inline-block px-1.5 py-0.5 rounded-md border border-black/5">
                    <p className="text-[6px] font-bold text-black opacity-40 uppercase tracking-widest">{d.s.category}</p>
                </div>
              </div>
              
              <div className="rounded-[1.2rem] overflow-hidden border border-black/5 shadow-inner">
                <img src={resolveServiceImageUrl(d.s)} alt={d.s.name} className="w-full aspect-[4/5] object-cover" />
              </div>

              <div className="space-y-3">
                <p className="text-[11px] text-black italic leading-relaxed font-medium opacity-60">"{d.s.description}"</p>
                <div className="pt-4 border-t border-black/5 flex justify-between items-end">
                   <div className="space-y-0.5">
                      <p className="text-[7px] font-bold text-black opacity-30 uppercase tracking-widest">Investment</p>
                      <p className="text-xl font-bold text-black tracking-tighter">₱{parseFloat(d.s.price).toLocaleString()}</p>
                   </div>
                   <div className="bg-slate-50 px-2 py-1 rounded-lg border border-black/5">
                      <p className="text-[7px] font-bold text-black opacity-40 uppercase tracking-widest">{Math.floor(d.s.duration / 60)}h Session</p>
                   </div>
                </div>
              </div>
            </div>

            <button onClick={() => nav('/client/Packages')} className="flex items-center gap-2 text-[7px] font-bold uppercase tracking-widest text-black opacity-40 hover:opacity-100 transition-all px-2 group">
               <svg className="w-2.5 h-2.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
               Back to Directory
            </button>
          </div>

          {/* Reservation Manifest Form - Ultra Compact */}
          <div className="lg:col-span-3">
            <form onSubmit={submit} className="bg-white rounded-[1.5rem] p-8 border border-black/10 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50 rounded-bl-full flex items-center justify-end pr-3 pt-1 text-lg opacity-5">✍️</div>
              
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Logistics</p>
                <h3 className="text-xl font-serif text-black">Reservation Manifest</h3>
              </div>

              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Session Date</label>
                    <input type="date" required className="w-full bg-slate-50 p-3 rounded-lg text-[10px] border border-black/10 text-black font-bold focus:bg-white focus:border-black transition-all outline-none" value={f.date} onChange={e => setF({...f, date: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Session Time</label>
                    <input type="time" required className="w-full bg-slate-50 p-3 rounded-lg text-[10px] border border-black/10 text-black font-bold focus:bg-white focus:border-black transition-all outline-none" value={f.time} onChange={e => setF({...f, time: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Venue Location</label>
                  <input type="text" placeholder="Specify Street, Barangay & Landmark" required className="w-full bg-slate-50 p-3 rounded-lg text-[10px] border border-black/10 text-black font-bold focus:bg-white focus:border-black transition-all outline-none" value={f.loc} onChange={e => setF({...f, loc: e.target.value})} />
                </div>

                <div className="rounded-xl overflow-hidden border border-black/10 shadow-sm grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                   <LocationPickerMap locationText={f.loc} onLocationSelect={({address}) => setF({...f, loc: address})} height="150px" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Creative Vision</label>
                  <textarea placeholder="Atmosphere, shots, priorities..." className="w-full bg-slate-50 p-3 rounded-lg text-[10px] h-24 border border-black/10 text-black font-bold focus:bg-white focus:border-black transition-all outline-none resize-none" value={f.note} onChange={e => setF({...f, note: e.target.value})} />
                </div>
              </div>

              <div className="pt-4 border-t border-black/5">
                <button type="submit" disabled={d.sub} className="w-full bg-black text-white py-3.5 rounded-lg text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] transition-all shadow-lg">
                  {d.sub ? 'AUTHORIZING...' : 'CONFIRM RESERVATION'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
