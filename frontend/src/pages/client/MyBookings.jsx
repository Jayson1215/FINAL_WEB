import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';

export default function MyBookings() {
  const nav = useNavigate();
  const location = useLocation();
  const [d, setD] = useState({ list: [], loading: true, sel: null });
  const [tab, setTab] = useState('active'); // active or history
  const [paymentStatus, setPaymentStatus] = useState(null); // success, cancelled, or booking_success
  const [payLoading, setPayLoading] = useState(null); // bookingId
  const highlightRef = useRef(null);
  const clearStatus = () => setPaymentStatus(null);

  const query = new URLSearchParams(location.search);
  const highlightedId = query.get('booking');

  useEffect(() => {
    const status = query.get('payment');
    const sessionId = query.get('session_id');
    const bookingId = query.get('booking_id');
    const bookingSuccess = query.get('booking_success');

    if (status === 'success' && (sessionId || bookingId)) {
      // Show verifying state while we confirm with backend
      setPaymentStatus('verifying');
      const verifyPromise = bookingId 
        ? paymentService.verifyPaymentByBooking(bookingId) 
        : paymentService.verifyPayment(sessionId);
        
      verifyPromise
        .then(() => {
          setPaymentStatus('success');
          fetchBookings();
        })
        .catch((err) => {
          console.error('Payment verification failed:', err);
          setPaymentStatus('error');
          fetchBookings(); // Still refresh bookings in case it was already processed
        });
    } else if (status === 'cancelled') {
      setPaymentStatus('cancelled');
    } else if (bookingSuccess) {
      setPaymentStatus('booking_success');
    }

    if (status || bookingSuccess) {
      const newPath = location.pathname + (highlightedId ? `?booking=${highlightedId}` : '');
      window.history.replaceState({}, '', newPath);
    }
  }, [location.search]);

  const fetchBookings = async () => {
    try { 
      const r = await bookingService.getMyBookings(); 
      setD({ list: r.data || [], loading: false, sel: null }); 
    }
    catch (e) { setD(p => ({ ...p, loading: false })); }
  };

  useEffect(() => { fetchBookings(); }, []);

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
  const activeBookings = d.list.filter(b => !['finished', 'rejected', 'cancelled'].includes(b.status));
  const historyBookings = d.list.filter(b => ['finished', 'rejected', 'cancelled'].includes(b.status));
  const displayList = tab === 'active' ? activeBookings : historyBookings;

  if (d.loading) return (
    <ClientLayout title="Accessing Bookings..." hideHero={true}>
        <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black">Retrieving Masterpiece History...</p>
        </div>
    </ClientLayout>
  );

  return (
    <ClientLayout title="Your Bookings" hideHero={true}>
      <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
        
        {/* Tab Selection - Professional Filtering */}
        <div className="flex justify-center gap-4">
           <button onClick={() => setTab('active')} className={`px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'active' ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-black border border-black'}`}>
              Active Sessions ({activeBookings.length})
           </button>
           <button onClick={() => setTab('history')} className={`px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'history' ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-black border border-black'}`}>
              Session History ({historyBookings.length})
           </button>
        </div>

        {displayList.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-black shadow-sm">
            <p className="text-black font-serif italic text-lg mb-8">
              {tab === 'active' ? 'Your active booking registry is currently empty.' : 'No historical sessions found in your archive.'}
            </p>
            {tab === 'active' && (
              <button onClick={() => nav('/client/Packages')} className="bg-black text-white px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] transition-all shadow-xl">Explore Collections</button>
            )}
          </div>
        ) : (
          <div className="grid gap-16">
            {displayList.map((b, idx) => {
              const displayId = `LW-${new Date(b.created_at).getFullYear()}-${(displayList.length - idx).toString().padStart(2, '0')}`;
              const isHighlighted = highlightedId === b.id.toString();
              return (
                <div 
                  key={b.id} 
                  ref={isHighlighted ? highlightRef : null}
                  className={`group relative bg-[#FAF9F6] rounded-[3rem] p-1 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-700 flex flex-col md:flex-row gap-0 overflow-hidden border border-black/5 border-t-[8px] ${isHighlighted ? 'border-[#C5A059] shadow-2xl scale-[1.01]' : 'border-black hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.2)] hover:-translate-y-1'}`}
                >
                  {/* Visual Column - Cinematic Dark Frame */}
                  <div className="w-full md:w-80 h-[320px] relative overflow-hidden shrink-0 border-r border-black/5 bg-[#111111]">
                    <img src={resolveServiceImageUrl(b.service)} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Content Column - Luxury Manifest */}
                  <div className="flex-1 flex flex-col justify-between relative">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-[10rem] font-serif pointer-events-none select-none italic leading-none">LW</div>
                    
                    <div className="relative z-10 p-8 pb-4">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-[1.5px] bg-[#C5A059]"></span>
                                <p className="text-[9px] font-bold text-[#C5A059] uppercase tracking-[0.4em]">{b.service?.category}</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="bg-black px-3 py-1 rounded-lg border border-white/10 shadow-sm">
                                    <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em]">{displayId}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-[7px] font-bold uppercase tracking-widest border shadow-sm ${getStatusColor(b.status)}`}>
                                    {b.status}
                                </div>
                            </div>
                        </div>
                        
                        <h3 className="text-2xl md:text-4xl font-serif text-black tracking-tighter mb-4 md:mb-6 leading-tight">{b.service?.name}</h3>
                    
                        <div className="grid grid-cols-2 gap-8 border-t border-black/5 pt-6">
                            <div className="space-y-1">
                                <p className="text-[8px] font-bold text-black/30 uppercase tracking-[0.3em]">Session Date</p>
                                <p className="text-lg font-medium text-black tracking-tight">{new Date(b.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[8px] font-bold text-black/30 uppercase tracking-[0.3em]">Investment</p>
                                <p className="text-xl font-serif text-[#C5A059]">₱{parseFloat(b.total_amount).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 p-8 pt-6 bg-[#F2F2F2]/50 border-t border-black/5 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[9px] font-bold shadow-lg">LW</div>
                            <div className="space-y-0.5">
                                <p className="text-[7px] font-bold text-black/20 uppercase tracking-widest leading-none">Destination</p>
                                <p className="text-[11px] font-bold text-black truncate max-w-[150px]">{b.location}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setD({ ...d, sel: { ...b, displayId } })} className="bg-white border border-black text-black px-6 py-3.5 rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all shadow-sm">DETAILS</button>
                            
                            {['confirmed', 'approved'].includes(b.status) && (parseFloat(b.total_amount) - parseFloat(b.paid_amount || 0)) >= 20 && (
                                <button 
                                onClick={async () => {
                                    setPayLoading(b.id);
                                    try {
                                    const res = await paymentService.createCheckoutSession({ booking_id: b.id, type: 'full' });
                                    if (res.data?.checkout_url) window.location.href = res.data.checkout_url;
                                    } catch (e) { alert(`Error: ${e.message}`); setPayLoading(null); }
                                }} 
                                className="bg-black text-white px-6 py-3.5 rounded-2xl text-[9px] font-bold uppercase tracking-[0.4em] shadow-lg hover:bg-[#C5A059] transition-all"
                                >
                                {payLoading === b.id ? '...' : 'SETTLE'}
                                </button>
                            )}
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>      {/* Pop-up Card Details - Ultra Compact Luxury Manifest */}
      {d.sel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000] flex items-center justify-center p-4" onClick={() => setD({ ...d, sel: null })}>
          <div className="bg-[#FAF9F6] rounded-[2rem] max-w-[380px] w-full shadow-2xl animate-cinemaShow border border-black/5 overflow-hidden relative max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-[5rem] font-serif pointer-events-none select-none">LW</div>
            
            <div className="relative z-10 px-6 pt-6 pb-3 border-b border-black/5">
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-[7px] font-bold text-[#C5A059] uppercase tracking-[0.4em]">Manifest ID</p>
                    <span className="text-[8px] font-bold text-black/40">{d.sel.displayId}</span>
                </div>
                <h3 className="text-xl font-serif text-black tracking-tighter leading-tight">{d.sel.service?.name}</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 relative z-10 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-black/5">
                <div className="space-y-0.5">
                  <p className="text-[7px] font-bold text-black/30 uppercase tracking-[0.3em]">Schedule</p>
                  <p className="text-[10px] font-bold text-black">
                    {new Date(d.sel.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} @ {(() => {
                      const [h, m] = d.sel.booking_time.split(':');
                      const dt = new Date();
                      dt.setHours(h, m);
                      return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                    })()}
                  </p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-[7px] font-bold text-black/30 uppercase tracking-[0.3em]">Investment</p>
                  <p className="text-lg font-serif text-[#C5A059]">₱{parseFloat(d.sel.total_amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[7px] font-bold text-black/30 uppercase tracking-[0.3em]">Venue</p>
                <div className="bg-black/5 p-3 rounded-xl border border-black/5">
                    <p className="text-[9px] font-bold text-black leading-tight">{d.sel.location}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[7px] font-bold text-black/30 uppercase tracking-[0.3em]">Vision</p>
                <div className="bg-black/5 p-3 rounded-xl border border-black/5">
                    <p className="text-[9px] font-medium text-black italic leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>"{d.sel.special_requests || 'Standard Studio Manifest'}"</p>
                </div>
              </div>

              {d.sel.add_ons?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[7px] font-bold text-[#C5A059] uppercase tracking-widest">Enhancements</p>
                  <div className="space-y-1">
                    {d.sel.add_ons.map(addon => (
                      <div key={addon.id} className="flex justify-between items-center bg-black/5 px-3 py-2 rounded-lg border border-black/5">
                        <p className="text-[8px] font-bold text-black">{addon.name}</p>
                        <p className="text-[9px] font-black text-[#C5A059]">₱{parseFloat(addon.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-black/5 relative z-10 bg-[#FAF9F6]">
              <button onClick={() => setD({ ...d, sel: null })} className="w-full bg-black text-white py-3 rounded-xl text-[8px] font-bold uppercase tracking-[0.4em] hover:bg-[#C5A059] transition-all shadow-lg">Close Manifest</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Overlay - Luxury Boutique Confirmation */}
      {paymentStatus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[3000] flex items-center justify-center p-6 animate-glassFade" onClick={paymentStatus !== 'verifying' ? clearStatus : undefined}>
           <div className="bg-[#FAF9F6]/95 backdrop-blur-md rounded-[3.5rem] max-w-sm w-full p-10 text-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-black/5 animate-glassPop relative overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>
              
              {paymentStatus === 'verifying' ? (
                <>
                  <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center relative z-10 bg-black/5">
                    <div className="w-12 h-12 border-4 border-black/10 border-t-[#C5A059] rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-3xl font-serif text-black mb-3 tracking-tighter relative z-10">Verifying Payment</h2>
                  <p className="text-[11px] text-black/60 italic font-medium leading-relaxed mb-10 relative z-10 px-4">
                    Confirming your payment with the gateway. This will only take a moment...
                  </p>
                </>
              ) : (
                <>
                  <div className={`w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center text-3xl shadow-2xl relative z-10 ${paymentStatus === 'success' ? 'bg-black text-[#C5A059] shadow-[#C5A059]/20' : paymentStatus === 'booking_success' ? 'bg-black text-[#C5A059] shadow-black/20' : paymentStatus === 'error' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-red-500 text-white shadow-red-500/20'}`}>
                    <div className={`absolute inset-0 rounded-full bg-white/10 ${paymentStatus === 'success' || paymentStatus === 'booking_success' ? 'animate-ping' : ''}`}></div>
                    <span className="relative z-20 font-serif">{paymentStatus === 'success' ? '✓' : paymentStatus === 'booking_success' ? '★' : '×'}</span>
                  </div>
                  
                  <h2 className="text-3xl font-serif text-black mb-3 tracking-tighter relative z-10">
                    {paymentStatus === 'success' ? 'Session Secured' : paymentStatus === 'booking_success' ? 'Manifest Logged' : paymentStatus === 'error' ? 'Verification Issue' : 'Action Required'}
                  </h2>
                  
                  <p className="text-[11px] text-black/60 italic font-medium leading-relaxed mb-10 relative z-10 px-4">
                    {paymentStatus === 'success' 
                      ? "Your creative session has been successfully finalized. We are now curating the studio environment for your arrival."
                      : paymentStatus === 'booking_success'
                      ? "Your reservation manifest has been received. Our curators will review the details and notify you via this portal."
                      : paymentStatus === 'error'
                      ? "We couldn't confirm your payment automatically. Don't worry — if you completed the payment, it will be verified shortly. Please check your booking status."
                      : "The transaction could not be verified. Your reservation remains active but requires manual settlement to proceed."}
                  </p>
                  
                  <button onClick={clearStatus} className="w-full py-5 bg-black text-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-[#C5A059] transition-all relative z-10">
                    {paymentStatus === 'booking_success' ? 'Back to Registry' : 'Enter Dashboard'}
                  </button>
                </>
              )}
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
          0% { opacity: 0; transform: scale(0.9) translateY(30px); filter: brightness(1.5); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
        }
        .animate-glassPop { animation: glassPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </ClientLayout>
  );
}
