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

  const query = new URLSearchParams(location.search);
  const highlightedId = query.get('booking');

  useEffect(() => {
    const status = query.get('payment');
    const sessionId = query.get('session_id');
    const bookingSuccess = query.get('booking_success');

    if (status) {
      setPaymentStatus(status);
      if (status === 'success' && sessionId) {
        paymentService.verifyPayment(sessionId).then(() => fetchBookings());
      }
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
    <ClientLayout title="Accessing Registry..." hideHero={true}>
        <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black">Retrieving Masterpiece History...</p>
        </div>
    </ClientLayout>
  );

  return (
    <ClientLayout title="Your Registry" hideHero={true}>
      <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
        
        {/* Tab Selection - Professional Filtering */}
        <div className="flex justify-center gap-4">
           <button onClick={() => setTab('active')} className={`px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'active' ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-black border border-black/10'}`}>
              Active Sessions ({activeBookings.length})
           </button>
           <button onClick={() => setTab('history')} className={`px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'history' ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-black border border-black/10'}`}>
              Session History ({historyBookings.length})
           </button>
        </div>

        {displayList.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-black/5 shadow-sm">
            <p className="text-black font-serif italic text-lg mb-8">
              {tab === 'active' ? 'Your active session registry is currently empty.' : 'No historical sessions found in your archive.'}
            </p>
            {tab === 'active' && (
              <button onClick={() => nav('/client/Packages')} className="bg-black text-white px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] transition-all shadow-xl">Explore Collections</button>
            )}
          </div>
        ) : (
          <div className="grid gap-10">
            {displayList.map((b, idx) => {
              const displayId = `LW-${new Date(b.created_at).getFullYear()}-${(displayList.length - idx).toString().padStart(2, '0')}`;
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
                        <p className="text-[8px] font-bold text-white uppercase tracking-widest leading-none">{displayId}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <p className="text-[9px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">{b.service?.category}</p>
                            <span className="w-1 h-1 bg-black/10 rounded-full"></span>
                            <p className="text-[9px] font-bold text-black uppercase tracking-widest">{displayId}</p>
                        </div>
                        <h3 className="text-3xl font-serif text-black tracking-tighter">{b.service?.name}</h3>
                      </div>
                      <div className={`px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border ${getStatusColor(b.status)}`}>
                        {b.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 border-t border-black/5 pt-8 mb-8">
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-black uppercase tracking-widest">Session Date</p>
                        <p className="text-[13px] font-bold text-black">{new Date(b.booking_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-black uppercase tracking-widest">Investment</p>
                        <p className="text-[13px] font-bold text-black">₱{parseFloat(b.total_amount).toLocaleString()}</p>
                      </div>
                      <div className="space-y-1 hidden md:block">
                        <p className="text-[8px] font-bold text-black uppercase tracking-widest">Venue Destination</p>
                        <p className="text-[11px] font-bold text-black truncate max-w-[150px]">{b.location}</p>
                      </div>
                    </div>
 
                    {b.admin_notes && (
                      <div className="bg-[#E8734A]/5 p-6 rounded-2xl border border-[#E8734A]/10 mb-8 relative">
                         <div className="absolute top-2 right-4 text-[7px] font-bold uppercase tracking-widest text-[#E8734A]">Studio Response</div>
                         <p className="text-[11px] text-[#E8734A] italic leading-relaxed font-medium">"{b.admin_notes}"</p>
                      </div>
                    )}
 
                    <div className="mt-auto flex flex-wrap gap-4 pt-6 border-t border-black/5">
                      {['confirmed', 'approved'].includes(b.status) && parseFloat(b.total_amount) - parseFloat(b.paid_amount || 0) > 0 && (
                        <button 
                          disabled={payLoading === b.id}
                          onClick={async () => {
                            setPayLoading(b.id);
                            try {
                              const res = await paymentService.createCheckoutSession({ booking_id: b.id, type: 'balance' });
                              if (res.data?.checkout_url) window.location.href = res.data.checkout_url;
                            } catch (e) { 
                              console.error('Payment Error:', e);
                              const msg = e.response?.data?.message || e.message || 'Unknown network error.';
                              alert(`Studio Payment Error: ${msg}`); 
                              setPayLoading(null); 
                            }
                          }} 
                          className="bg-black text-white px-8 py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-lg hover:bg-[#E8734A] transition-all disabled:opacity-50 disabled:cursor-wait"
                        >
                          {payLoading === b.id ? 'Establishing Secure Link...' : `Proceed Studio Payment (₱${(parseFloat(b.total_amount) - parseFloat(b.paid_amount || 0)).toLocaleString()})`}
                        </button>
                      )}
                      <button onClick={() => setD({ ...d, sel: { ...b, displayId } })} className="bg-white border border-black/10 text-black px-8 py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Session Details</button>
                      {b.status === 'pending' && (
                        <button onClick={() => cancel(b.id)} className="ml-auto text-black hover:text-red-500 text-[9px] font-bold uppercase tracking-widest transition-all">Request Cancellation</button>
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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[2000] flex items-center justify-center p-6 lg:p-12" onClick={() => setD({ ...d, sel: null })}>
          <div className="bg-white rounded-[4rem] max-w-xl w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-cinemaShow border border-white/20 overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-12 opacity-5 text-[10rem] font-serif pointer-events-none select-none">LW</div>
            
            <div className="relative z-10 px-12 pt-12 pb-6 border-b border-black/5">
                <div className="flex items-center gap-3 mb-2">
                    <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Personal Session ID</p>
                    <span className="text-[10px] font-bold text-black">{d.sel.displayId}</span>
                </div>
                <h3 className="text-5xl font-serif text-black tracking-tighter">{d.sel.service?.name}</h3>
            </div>
            
            <div className="px-12 py-10 space-y-10 relative z-10">
              <div className="grid grid-cols-2 gap-8 pb-8 border-b-2 border-black/10">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-black uppercase tracking-[0.3em]">Schedule</p>
                  <p className="text-sm font-bold text-black">
                    {new Date(d.sel.booking_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} @ {(() => {
                      const [h, m] = d.sel.booking_time.split(':');
                      const dt = new Date();
                      dt.setHours(h, m);
                      return dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
                    })()}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[8px] font-bold text-black uppercase tracking-[0.3em]">Investment</p>
                  <p className="text-xl font-black text-black">₱{parseFloat(d.sel.total_amount).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[8px] font-bold text-black uppercase tracking-[0.3em]">Venue Destination</p>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-black/10">
                    <p className="text-xs font-bold text-black leading-relaxed">{d.sel.location}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[8px] font-bold text-black uppercase tracking-[0.3em]">Your Creative Vision</p>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-black/10">
                    <p className="text-xs font-medium text-black italic leading-relaxed font-serif">"{d.sel.special_requests || 'No specific creative requests provided.'}"</p>
                </div>
              </div>

              {d.sel.add_ons?.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-widest">Package Enhancements (Add-ons)</p>
                  <div className="space-y-2">
                    {d.sel.add_ons.map(addon => (
                      <div key={addon.id} className="flex justify-between items-center bg-slate-50 px-6 py-4 rounded-2xl border border-black/10">
                        <p className="text-[11px] font-bold text-black">{addon.name}</p>
                        <p className="text-xs font-black text-[#E8734A]">₱{parseFloat(addon.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-12 pb-12 relative z-10">
              <button onClick={() => setD({ ...d, sel: null })} className="w-full bg-black text-white py-6 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#E8734A] transition-all shadow-2xl">Close Manifest</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Overlay - Cinematic Confirmation */}
      {paymentStatus && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[3000] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setPaymentStatus(null)}>
           <div className="bg-white rounded-[4rem] max-w-md w-full p-12 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 animate-cinemaShow" onClick={e => e.stopPropagation()}>
              <div className={`w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl shadow-2xl ${paymentStatus === 'success' ? 'bg-emerald-500 text-white' : paymentStatus === 'booking_success' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}`}>
                {paymentStatus === 'success' ? '✓' : paymentStatus === 'booking_success' ? '★' : '×'}
              </div>
              
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-4">
                {paymentStatus === 'booking_success' ? 'Logistics Synchronized' : 'Masterpiece Secured'}
              </p>
              <h3 className="text-4xl font-serif text-black mb-6 tracking-tighter">
                {paymentStatus === 'success' ? 'Transaction Confirmed' : paymentStatus === 'booking_success' ? 'Reservation Logged' : 'Payment Interrupted'}
              </h3>
              
              <p className="text-sm text-black italic font-medium opacity-60 leading-relaxed mb-10">
                {paymentStatus === 'success' 
                  ? "Your creative session has been successfully logged in our master registry. We are now preparing the studio for your arrival."
                  : paymentStatus === 'booking_success'
                  ? "Your reservation request has been transmitted to our curators. We will review the date and notify you once approved for payment."
                  : "The transaction was not completed. Your reservation remains in the registry but is currently awaiting settlement."}
              </p>
              
              <button onClick={() => setPaymentStatus(null)} className="w-full py-6 bg-black text-white rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] shadow-xl hover:bg-[#E8734A] transition-all">
                {paymentStatus === 'booking_success' ? 'View Registry' : 'Enter Dashboard'}
              </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes cinemaShow {
          0% { opacity: 0; transform: scale(0.9) translateY(40px); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        .animate-cinemaShow { animation: cinemaShow 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </ClientLayout>
  );
}
