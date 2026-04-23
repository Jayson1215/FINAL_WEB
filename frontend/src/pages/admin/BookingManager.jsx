import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { bookingService } from '../../services/bookingService';

export default function BookingManager() {
  const [d, setD] = useState({ list: [], loading: true, err: '' });
  const [modal, setModal] = useState({ open: false, b: null, st: '', note: '' });
  const [viewModal, setViewModal] = useState({ open: false, b: null });

  useEffect(() => { fetch(); }, []);
  const fetch = async () => {
    try { const r = await bookingService.getAllBookings(); setD({ list: r.data || [], loading: false, err: '' }); }
    catch (e) { setD(p => ({ ...p, loading: false, err: 'Sync Failed' })); }
  };

  const openAction = (b, st) => {
    setModal({ open: true, b, st, note: b.admin_notes || '' });
  };

  const update = async () => {
    const { b, st, note } = modal;
    try {
      const res = await bookingService.updateBookingStatus(b.id, { status: st, admin_notes: note });
      setD(p => ({ ...p, list: p.list.map(i => i.id === b.id ? res.data : i) }));
      setModal({ open: false, b: null, st: '', note: '' });
    } catch (e) { setD(p => ({ ...p, err: 'Update Failed' })); }
  };

  const getStatusStyle = (s) => {
    switch (s) {
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
    <AdminLayout title="Manage Bookings">
      <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black opacity-30">Accessing Master Registry...</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Reservation Registry">
      <div className="space-y-10 animate-fadeIn pb-20">
        
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-black/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
          
          <div className="px-12 py-10 border-b border-black/10 flex justify-between items-center bg-slate-50/20">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Control Center</p>
              <h3 className="text-2xl font-serif text-black tracking-tighter">Global Booking Directory</h3>
            </div>
            <div className="bg-white border border-black/10 px-6 py-2.5 rounded-2xl flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-black">Active Nodes: {d.list.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-black/10">
                  <th className="px-12 py-6 text-[10px] font-bold text-black uppercase tracking-[0.3em]">ID & Client</th>
                  <th className="px-12 py-6 text-[10px] font-bold text-black uppercase tracking-[0.3em]">Package</th>
                  <th className="px-12 py-6 text-[10px] font-bold text-black uppercase tracking-[0.3em]">Venue Location</th>
                  <th className="px-12 py-6 text-[10px] font-bold text-black uppercase tracking-[0.3em]">Schedule</th>
                  <th className="px-12 py-6 text-[10px] font-bold text-black uppercase tracking-[0.3em]">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {d.list.map(b => (
                  <tr key={b.id} className="group hover:bg-slate-50/50 transition-all duration-500">
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-5 cursor-pointer" onClick={() => setViewModal({open: true, b})}>
                        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-[9px] shadow-lg group-hover:scale-110 transition-transform flex-col leading-none gap-1">
                          <span className="opacity-40">Ref</span>
                          <span>{b.id}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black tracking-tight group-hover:text-[#E8734A] transition-colors">{b.user?.name}</p>
                          <p className="text-[8px] text-black opacity-30 font-bold uppercase tracking-[0.2em]">{formatId(b.id)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                        <div className="bg-slate-50 inline-block px-3 py-1.5 rounded-xl border border-black/5">
                            <p className="text-[10px] font-bold text-black italic opacity-60">"{b.service?.name}"</p>
                        </div>
                    </td>
                    <td className="px-12 py-8 max-w-[200px]">
                        <p className="text-[11px] font-bold text-black opacity-60 truncate">{b.location}</p>
                    </td>
                    <td className="px-12 py-8">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-black tracking-tighter">{new Date(b.booking_date).toLocaleDateString()}</p>
                        <p className="text-[9px] text-[#E8734A] font-bold uppercase tracking-widest">{b.booking_time}</p>
                      </div>
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-3">
                         <div className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${getStatusStyle(b.status)} shadow-sm`}>
                            {b.status}
                         </div>
                         
                         {b.status === 'pending' && (
                           <div className="flex gap-2 ml-4 animate-fadeIn">
                             <button onClick={() => openAction(b, 'confirmed')} className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Confirm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                             </button>
                             <button onClick={() => openAction(b, 'rejected')} className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title="Reject">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                             </button>
                           </div>
                         )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pop-up Table Details - Session Manifest */}
      {viewModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[2000] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setViewModal({open: false, b: null})}>
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 max-w-2xl w-full border border-black/10 relative animate-modalPop overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-serif">INFO</div>
            
            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.4em]">Full Session Manifest</p>
                    <h3 className="text-3xl font-serif text-black">{viewModal.b.user?.name}</h3>
                    <p className="text-[10px] font-bold uppercase text-black/30 tracking-[0.3em]">{formatId(viewModal.b.id)}</p>
                </div>
                <button onClick={() => setViewModal({open: false, b: null})} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">&times;</button>
            </div>

            <div className="bg-slate-50/50 rounded-[2rem] border border-black/5 overflow-hidden mb-8">
                <table className="w-full text-[11px]">
                    <tbody className="divide-y divide-black/5">
                        <tr>
                            <td className="px-8 py-5 font-bold uppercase tracking-widest text-black/30 w-1/3 bg-slate-100/50">Collection</td>
                            <td className="px-8 py-5 font-bold text-black italic">"{viewModal.b.service?.name}"</td>
                        </tr>
                        <tr>
                            <td className="px-8 py-5 font-bold uppercase tracking-widest text-black/30 bg-slate-100/50">Venue Destination</td>
                            <td className="px-8 py-5 font-bold text-black">{viewModal.b.location}</td>
                        </tr>
                        <tr>
                            <td className="px-8 py-5 font-bold uppercase tracking-widest text-black/30 bg-slate-100/50">Logistics Date</td>
                            <td className="px-8 py-5 font-bold text-black">{new Date(viewModal.b.booking_date).toLocaleDateString()} @ {viewModal.b.booking_time}</td>
                        </tr>
                        <tr>
                            <td className="px-8 py-5 font-bold uppercase tracking-widest text-black/30 bg-slate-100/50">Creative Vision</td>
                            <td className="px-8 py-5 font-medium text-black/60 italic leading-relaxed">"{viewModal.b.special_requests || 'No specific creative requests provided.'}"</td>
                        </tr>
                        <tr>
                            <td className="px-8 py-5 font-bold uppercase tracking-widest text-black/30 bg-slate-100/50">Financial Manifest</td>
                            <td className="px-8 py-5 font-bold text-black">₱{parseFloat(viewModal.b.total_amount).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button onClick={() => setViewModal({open: false, b: null})} className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] shadow-xl hover:bg-[#E8734A] transition-all">Dismiss Manifest</button>
          </div>
        </div>
      )}

      {/* Decision Log Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[2000] flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white rounded-[3.5rem] shadow-2xl p-12 max-w-md w-full border border-black/10 relative animate-modalPop">
            <div className="text-center mb-10">
                <div className={`inline-block px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border mb-4 ${getStatusStyle(modal.st)}`}>
                    Action: {modal.st}
                </div>
                <h3 className="text-3xl font-serif text-black tracking-tighter">Commit Decision</h3>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-bold text-black uppercase tracking-widest ml-2">Concierge Message</label>
                <textarea 
                  value={modal.note}
                  onChange={e => setModal({...modal, note: e.target.value})}
                  className="w-full bg-slate-50 p-6 rounded-[2rem] h-40 text-xs text-black border border-black/10 outline-none focus:border-black focus:bg-white transition-all resize-none italic font-medium opacity-70" 
                  placeholder="e.g., 'We have full availability for this session...'"
                ></textarea>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setModal({open:false,b:null,st:'',note:''})} className="flex-1 py-5 border border-black/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-black hover:bg-slate-50 transition-all">Dismiss</button>
              <button onClick={update} className="flex-1 py-5 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-xl">Commit Action</button>
            </div>
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
    </AdminLayout>
  );
}
