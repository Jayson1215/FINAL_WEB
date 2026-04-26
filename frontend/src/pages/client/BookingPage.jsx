import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';
import LocationPickerMap from '../../components/common/LocationPickerMap';

export default function BookingPage() {
  const { serviceId } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState({ s: null, a: [], loading: true, sub: false, err: '', showConfirm: false });
  const [f, setF] = useState({ date: '', time: '', loc: '', note: '', selectedAddOns: [] });

  useEffect(() => {
    (async () => {
      try {
        const [s, a] = await Promise.all([
          serviceService.getServiceDetail(serviceId),
          bookingService.getAddOns() // I'll need to add this to bookingService
        ]);
        setD({ s: s.data, a: a.data || [], loading: false, sub: false, err: '' });
      } catch (e) {
        setD(p => ({ ...p, loading: false, err: 'Failed to synchronize package data.' }));
      }
    })();
  }, [serviceId]);

  const totalAmount = useMemo(() => {
    if (!d.s) return 0;
    const addonsTotal = f.selectedAddOns.reduce((sum, id) => {
      const addon = d.a.find(a => a.id === id);
      return sum + (addon ? parseFloat(addon.price) : 0);
    }, 0);
    return parseFloat(d.s.price) + addonsTotal;
  }, [d.s, d.a, f.selectedAddOns]);

  // Calculate session window
  const sessionWindow = useMemo(() => {
    if (!f.time || !d.s?.duration) return null;
    
    const [hours, minutes] = f.time.split(':').map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0);
    
    const end = new Date(start.getTime() + d.s.duration * 60000);
    
    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return {
      start: formatTime(start),
      end: formatTime(end),
      durationHours: (d.s.duration / 60).toFixed(0)
    };
  }, [f.time, d.s]);

  const toggleAddOn = (id) => {
    setF(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(id)
        ? prev.selectedAddOns.filter(i => i !== id)
        : [...prev.selectedAddOns, id]
    }));
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    setD(p => ({ ...p, showConfirm: true }));
  };

  const finalSubmit = async () => {
    setD(p => ({ ...p, sub: true, err: '', showConfirm: false }));
    try {
      const res = await bookingService.createBooking({
        service_id: serviceId,
        booking_date: f.date,
        booking_time: f.time,
        location: f.loc,
        special_requests: f.note,
        total_amount: totalAmount,
        add_on_ids: f.selectedAddOns
      });

      const bookingId = res.data?.id || res.data?.data?.id;

      if (!bookingId) {
        throw new Error('Booking created but ID missing.');
      }

      // Redirect to MyBookings for Admin Approval
      nav(`/client/MyBookings?booking_success=true&booking=${bookingId}`);
    } catch (err) {
      console.error('Submission error:', err);
      setD(p => ({ ...p, sub: false, err: err.response?.data?.message || 'Transaction error.' }));
    }
  };

  if (d.loading) return <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]"><div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>;
  
  if (!d.s) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] p-6 text-center">
      <h2 className="text-3xl font-serif text-black mb-4">Package Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">The package you are looking for might have been updated or removed during our system maintenance.</p>
      <button onClick={() => nav('/client/Packages')} className="bg-black text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest">View All Packages</button>
    </div>
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
          
          {/* Package Detail Sidebar */}
          <div className="lg:col-span-2 space-y-4 sticky top-24">
            <div className="bg-white rounded-[1.5rem] p-5 border border-black/10 shadow-sm space-y-5 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
              
              <div className="space-y-2">
                <p className="text-[7px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Selection</p>
                <h2 className="text-2xl font-serif text-black leading-tight tracking-tighter">{d.s.name}</h2>
              </div>
              
              <div className="rounded-[1.2rem] overflow-hidden border border-black/5 shadow-inner">
                <img src={resolveServiceImageUrl(d.s)} alt={d.s.name} className="w-full aspect-[4/5] object-cover" />
              </div>

              <div className="space-y-6">
                <p className="text-[11px] text-black italic leading-relaxed font-medium opacity-60">"{d.s.description}"</p>
                
                {d.s.inclusions && (
                  <div className="space-y-3 pt-4 border-t border-black/5">
                    <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-[0.3em]">Package Inclusions</p>
                    <div className="space-y-2">
                      {d.s.inclusions.split('\n').map((inc, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <div className="w-1 h-1 rounded-full bg-black mt-1.5 opacity-20"></div>
                          <p className="text-[9px] text-black/70 font-medium leading-tight">{inc.replace('• ', '')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-black/5 flex justify-between items-end">
                   <div className="space-y-0.5">
                      <p className="text-[7px] font-bold text-black opacity-30 uppercase tracking-widest">Total Investment</p>
                      <p className="text-xl font-bold text-black tracking-tighter">₱{totalAmount.toLocaleString()}</p>
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

          {/* Reservation Manifest Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handlePreSubmit} className="bg-white rounded-[1.5rem] p-8 border border-black/10 shadow-sm space-y-6 relative overflow-hidden">
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Logistics</p>
                <h3 className="text-xl font-serif text-black">Booking Manifest</h3>
              </div>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Date</label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 p-3 rounded-xl text-[10px] border border-black/10 text-black font-bold focus:bg-white focus:border-black transition-all outline-none" value={f.date} onChange={e => setF({...f, date: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Time</label>
                    <input type="time" required className="w-full bg-slate-50 p-3 rounded-xl text-[10px] border border-black/10 text-black font-bold focus:bg-white focus:border-black transition-all outline-none" value={f.time} onChange={e => setF({...f, time: e.target.value})} />
                    
                    {sessionWindow && (
                        <div className="mt-2 animate-fadeIn">
                           <div className="bg-[#1E293B] px-4 py-2.5 rounded-xl shadow-md flex items-center justify-between border border-white/10">
                              <div className="space-y-0">
                                 <p className="text-[7px] font-bold text-white opacity-40 uppercase tracking-widest">End Time ({sessionWindow.durationHours}h)</p>
                                 <p className="text-[9px] font-bold text-[#E8734A] tracking-widest">{sessionWindow.end}</p>
                              </div>
                              <svg className="w-3.5 h-3.5 text-[#E8734A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                           </div>
                        </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Location</label>
                  <input type="text" placeholder="Specify Street, Barangay & Landmark" required className="w-full bg-slate-50 p-3 rounded-xl text-[10px] border border-black/10 text-black font-bold focus:bg-white focus:border-black transition-all outline-none" value={f.loc} onChange={e => setF({...f, loc: e.target.value})} />
                </div>

                <div className="rounded-xl overflow-hidden border border-black/10 shadow-sm transition-all duration-500">
                   <LocationPickerMap locationText={f.loc} onLocationSelect={({address}) => setF({...f, loc: address})} height="300px" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Special Requests</label>
                  <textarea placeholder="Atmosphere, shots, priorities..." className="w-full bg-slate-50 p-3 rounded-xl text-[10px] h-20 border border-black/10 text-black font-bold focus:bg-white focus:border-black transition-all outline-none resize-none" value={f.note} onChange={e => setF({...f, note: e.target.value})} />
                </div>

                {d.a.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-[8px] font-bold text-black uppercase tracking-widest pl-1">Enhance Your Package (Add-ons)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {d.a.map(addon => (
                        <div key={addon.id} onClick={() => toggleAddOn(addon.id)} className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${f.selectedAddOns.includes(addon.id) ? 'border-[#E8734A] bg-orange-50/50' : 'border-black/5 bg-slate-50'}`}>
                           <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-black tracking-tight">{addon.name}</p>
                              <p className="text-[9px] font-bold text-[#E8734A]">₱{parseFloat(addon.price).toLocaleString()}</p>
                           </div>
                           <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${f.selectedAddOns.includes(addon.id) ? 'border-[#E8734A] bg-[#E8734A]' : 'border-black/10'}`}>
                              {f.selectedAddOns.includes(addon.id) && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
      {/* Glassmorphic Masterpiece Confirmation */}
      {d.showConfirm && (
        <div className="fixed inset-0 bg-slate-400/20 backdrop-blur-2xl z-[4000] flex items-center justify-center p-6 animate-glassFade">
           <div className="bg-white/80 backdrop-blur-md rounded-[4rem] max-w-xl w-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] animate-glassPop border border-white/50 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 text-[10rem] font-serif pointer-events-none select-none">LW</div>
              
              <div className="px-12 py-12 space-y-10 relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Final Verification</p>
                  <h3 className="text-4xl font-serif text-black tracking-tighter">Confirm Masterpiece Manifest</h3>
                </div>

                <div className="bg-slate-50/50 rounded-[2.5rem] border border-black overflow-hidden">
                   <table className="w-full text-left">
                      <tbody className="divide-y divide-black/5">
                         <tr>
                            <td className="px-8 py-5 text-[9px] font-bold uppercase tracking-widest text-black w-1/3">Session</td>
                            <td className="px-8 py-5 text-[12px] font-bold text-black italic">"{d.s.name}"</td>
                         </tr>
                         <tr>
                            <td className="px-8 py-5 text-[9px] font-bold uppercase tracking-widest text-black">Logistics</td>
                            <td className="px-8 py-5 text-[12px] font-bold text-black">{new Date(f.date).toLocaleDateString()} @ {sessionWindow?.start}</td>
                         </tr>
                         <tr>
                            <td className="px-8 py-5 text-[9px] font-bold uppercase tracking-widest text-black">Destination</td>
                            <td className="px-8 py-5 text-[11px] font-bold text-black">{f.loc}</td>
                         </tr>
                         <tr>
                            <td className="px-8 py-5 text-[9px] font-bold uppercase tracking-widest text-black">Investment</td>
                            <td className="px-8 py-5 text-xl font-black text-[#E8734A]">₱{totalAmount.toLocaleString()}</td>
                         </tr>
                      </tbody>
                   </table>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setD(p => ({ ...p, showConfirm: false }))} className="flex-1 py-6 border border-black rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] text-black hover:bg-white transition-all">Review Details</button>
                  <button onClick={finalSubmit} className="flex-2 bg-black text-white px-10 py-6 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#E8734A] transition-all shadow-2xl">Proceed Transaction</button>
                </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes glassFade {
          0% { opacity: 0; backdrop-filter: blur(0px); }
          100% { opacity: 1; backdrop-filter: blur(40px); }
        }
        .animate-glassFade { animation: glassFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes glassPop {
          0% { opacity: 0; transform: scale(0.95) translateY(30px); filter: brightness(1.2); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
        }
        .animate-glassPop { animation: glassPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </ClientLayout>
  );
}
