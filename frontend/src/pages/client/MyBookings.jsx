import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';

export default function MyBookings() {
  const nav = useNavigate();
  const location = useLocation();
  const [d, setD] = useState({ list: [], loading: true, sel: null });
  const highlightRef = useRef(null);

  const query = new URLSearchParams(location.search);
  const highlightedId = query.get('booking');

  useEffect(() => {
    (async () => {
      try { 
        const r = await bookingService.getMyBookings(); 
        setD({ list: r.data || [], loading: false, sel: null }); 
      }
      catch (e) { setD(p => ({ ...p, loading: false })); }
    })();
  }, []);

  useEffect(() => {
    if (!d.loading && highlightedId && highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [d.loading, highlightedId]);

  const cancel = async (id) => {
    if (window.confirm('Request cancellation for this session?')) {
      try {
        await bookingService.requestCancellation(id, { reason: 'User requested cancellation' });
        setD(p => ({ ...p, list: p.list.map(b => b.id === id ? { ...b, status: 'cancelled' } : b) }));
      } catch (e) { alert('Failed to cancel.'); }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'confirmed': 
        case 'approved': 
        case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'rejected': 
        case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const formatId = (id) => `LW-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;

  if (d.loading) return (
    <ClientLayout title="Accessing Registry..." hideHero={true}>
        <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black opacity-30">Retrieving Masterpiece History...</p>
        </div>
    </ClientLayout>
  );

  return (
    <ClientLayout title="Your Registry" hideHero={true}>
      <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
        {d.list.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-black/5 shadow-sm">
            <p className="text-black/30 font-serif italic text-lg mb-8">Your session registry is currently empty.</p>
            <button onClick={() => nav('/client/Packages')} className="bg-black text-white px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] transition-all shadow-xl">Explore Collections</button>
          </div>
        ) : (
          <div className="grid gap-10">
            {d.list.map(b => {
              const isHighlighted = highlightedId === b.id.toString();
              return (
                <div 
                  key={b.id} 
                  ref={isHighlighted ? highlightRef : null}
                  className={`bg-white rounded-[3rem] p-10 border transition-all duration-1000 flex flex-col md:flex-row gap-12 relative overflow-hidden ${isHighlighted ? 'border-[#E8734A] shadow-2xl scale-[1.02] ring-4 ring-[#E8734A]/5' : 'border-black/5 shadow-sm hover:shadow-xl hover:border-black/10'}`}
                >
                  {isHighlighted && <div className="absolute top-0 left-0 w-full h-2 bg-[#E8734A] animate-pulse"></div>}
                  
                  <div className="w-full md:w-72 aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-black/5 shadow-inner shrink-0 relative group">
                    <img src={resolveServiceImageUrl(b.service)} className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-xl">
                        <p className="text-[8px] font-bold text-white uppercase tracking-widest leading-none">{formatId(b.id)}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <p className="text-[9px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">{b.service?.category}</p>
                            <span className="w-1 h-1 bg-black/10 rounded-full"></span>
                            <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest">{formatId(b.id)}</p>
                        </div>
                        <h3 className="text-3xl font-serif text-black tracking-tighter">{b.service?.name}</h3>
                      </div>
                      <div className={`px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(b.status)}`}>
                        {b.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 border-t border-black/5 pt-8 mb-8">
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-black opacity-30 uppercase tracking-widest">Session Date</p>
                        <p className="text-[13px] font-bold text-black">{new Date(b.booking_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-black opacity-30 uppercase tracking-widest">Investment</p>
                        <p className="text-[13px] font-bold text-black">₱{parseFloat(b.total_amount).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1 hidden md:block">
                        <p className="text-[8px] font-bold text-black opacity-30 uppercase tracking-widest">Venue Destination</p>
                        <p className="text-[11px] font-bold text-black truncate max-w-[150px]">{b.location}</p>
                      </div>
                    </div>

                    {b.admin_notes && (
                      <div className="bg-[#E8734A]/5 p-6 rounded-2xl border border-[#E8734A]/10 mb-8 relative">
                         <div className="absolute top-2 right-4 text-[7px] font-bold uppercase tracking-widest text-[#E8734A] opacity-40 italic">Concierge Response</div>
                         <p className="text-[11px] text-[#E8734A] italic leading-relaxed font-medium">"{b.admin_notes}"</p>
                      </div>
                    )}

                    <div className="mt-auto flex flex-wrap gap-4 pt-6 border-t border-black/5">
                      {b.status === 'awaiting_payment' && (
                        <button onClick={() => nav('/client/checkout', { state: { booking: b } })} className="bg-black text-white px-8 py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#E8734A] transition-all">Settle Payment</button>
                      )}
                      <button onClick={() => setD({ ...d, sel: b })} className="bg-white border border-black/10 text-black px-8 py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Session Details</button>
                      {(b.status === 'pending' || b.status === 'approved' || b.status === 'confirmed') && (
                        <button onClick={() => cancel(b.id)} className="ml-auto text-black/30 hover:text-red-500 text-[9px] font-bold uppercase tracking-widest transition-all">Request Cancellation</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pop-up Card Details - Immersive Manifest */}
      {d.sel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-6" onClick={() => setD({ ...d, sel: null })}>
          <div className="bg-white p-12 rounded-[3.5rem] max-w-xl w-full shadow-2xl animate-modalPop border border-black/10 overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl font-serif">MANIFEST</div>
            
            <div className="relative z-10 mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Personal Session ID</p>
                    <span className="text-[10px] font-bold text-black opacity-30">{formatId(d.sel.id)}</span>
                </div>
                <h3 className="text-3xl font-serif text-black tracking-tighter">{d.sel.service?.name}</h3>
            </div>
            
            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-2 gap-8 pb-6 border-b border-black/5">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-black opacity-30 uppercase tracking-widest">Schedule</p>
                  <p className="text-sm font-bold text-black">{new Date(d.sel.booking_date).toLocaleDateString()} @ {d.sel.booking_time}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[8px] font-bold text-black opacity-30 uppercase tracking-widest">Investment</p>
                  <p className="text-sm font-bold text-black">₱{parseFloat(d.sel.total_amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[8px] font-bold text-black opacity-30 uppercase tracking-widest">Venue Destination</p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-black/5">
                    <p className="text-[11px] font-bold text-black leading-relaxed">{d.sel.location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[8px] font-bold text-black opacity-30 uppercase tracking-widest">Your Creative Vision</p>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-black/5">
                    <p className="text-[11px] font-medium text-black italic opacity-60 leading-relaxed font-serif">"{d.sel.special_requests || 'No specific creative requests provided.'}"</p>
                </div>
              </div>
            </div>

            <button onClick={() => setD({ ...d, sel: null })} className="relative z-10 w-full bg-black text-white mt-10 py-5 rounded-2xl text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-[#E8734A] transition-all shadow-xl">Close Manifest</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.95) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalPop { animation: modalPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </ClientLayout>
  );
}
