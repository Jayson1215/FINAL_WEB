import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { bookingService } from '../../services/bookingService';

const NoteModal = ({ isOpen, onClose, onConfirm, currentNote, status }) => {
  const [note, setNote] = useState(currentNote || '');
  
  useEffect(() => {
    if (isOpen) setNote(currentNote || '');
  }, [isOpen, currentNote]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1E293B]/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#F1F5F9] animate-slideUp">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#F8F9FB] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-2xl font-serif text-[#1E293B]">Decision Note</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8734A]">Status: {status}</p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Optional Message for Client</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., Your selected time is available, we'll see you there!"
              className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-2xl px-6 py-5 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all h-36 resize-none placeholder:text-[#CBD5E1]"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button 
              onClick={onClose} 
              className="flex-1 px-6 py-5 border border-[#F1F5F9] text-[#64748B] rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#F8F9FB] transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(note)} 
              className="flex-1 px-6 py-5 bg-[#1E293B] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#E8734A] hover:shadow-lg transition-all"
            >
              Confirm Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [highlightedBookingId, setHighlightedBookingId] = useState('');
  const [noteModal, setNoteModal] = useState({ isOpen: false, booking: null, nextStatus: '' });
  const location = useLocation();

  useEffect(() => { fetchBookings(); }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingId = params.get('booking');

    if (!bookingId || loading) return;

    setHighlightedBookingId(bookingId);

    const timer = setTimeout(() => {
      const element = document.querySelector(`[data-booking-id="${bookingId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);

    const clearTimer = setTimeout(() => setHighlightedBookingId(''), 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(clearTimer);
    };
  }, [loading, location.search]);

  const fetchBookings = async () => { 
    try { 
      setLoading(true); 
      const r = await bookingService.getAllBookings(); 
      setBookings(r.data); 
    } catch(e){ 
      setError('Failed to load bookings'); 
    } finally { 
      setLoading(false); 
    } 
  };

  const handleStatusChange = async (booking, nextStatus, adminNotes = null) => {
    const previous = bookings;

    try {
      setError('');
      setBookings((prev) => prev.map((b) => (
        b.id === booking.id
          ? { ...b, status: nextStatus, ...(adminNotes !== null ? { admin_notes: adminNotes } : {}) }
          : b
      )));

      const response = await bookingService.updateBookingStatus(booking.id, {
        status: nextStatus,
        ...(adminNotes !== null ? { admin_notes: adminNotes } : {}),
      });

      setBookings((prev) => prev.map((b) => (b.id === booking.id ? response.data : b)));
      setNoteModal({ isOpen: false, booking: null, nextStatus: '' });
    } catch (e) {
      setBookings(previous);
      setError('Failed to update status');
    }
  };

  const openNoteModal = (booking, nextStatus) => {
    setNoteModal({ isOpen: true, booking, nextStatus });
  };
  
  const getStatusStyle = (s) => {
    switch(s) {
      case 'finished': return 'bg-[#F1F5F9] text-[#64748B]';
      case 'paid': return 'bg-[#ECFDF5] text-[#10B981]';
      case 'approved': return 'bg-[#F0F9FF] text-[#0EA5E9]';
      case 'awaiting_payment': return 'bg-[#FFF7ED] text-[#EA580C]';
      case 'confirmed': return 'bg-[#ECFDF5] text-[#10B981]';
      case 'rejected': return 'bg-[#FEF2F2] text-[#EF4444]';
      case 'cancelled': return 'bg-[#FEF2F2] text-[#EF4444]';
      default: return 'bg-[#FFFBEB] text-[#F59E0B]';
    }
  };

  if(loading&&bookings.length===0) return (<AdminLayout title="Manage Requests"><div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto"></div></div></AdminLayout>);

  return (
    <AdminLayout title="Booking Requests">
      <NoteModal 
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal({ ...noteModal, isOpen: false })}
        status={noteModal.nextStatus}
        currentNote={noteModal.booking?.admin_notes}
        onConfirm={(note) => handleStatusChange(noteModal.booking, noteModal.nextStatus, note)}
      />

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      
      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-1">On-Call Requests</h2>
            <p className="text-sm text-[#94A3B8]">Review and manage incoming photography service requests.</p>
          </div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#F1F5F9] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">New Workflow Active</span>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-premium border border-[#F1F5F9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FB] border-b border-[#F1F5F9]">
                <tr>
                  {['Client','Schedule','Location','Investment','Status & Action'].map(h=>(
                    <th key={h} className={`px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] ${h.includes('Status')?'text-right':''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F9FB]">
                {bookings.length>0 ? bookings.map(b=>(
                  <tr 
                    key={b.id} 
                    data-booking-id={b.id}
                    className={`hover:bg-[#FAFBFC] transition-all duration-500 group ${highlightedBookingId === b.id ? 'bg-[#FFF7ED] ring-2 ring-[#FDBA74] ring-inset' : ''}`}
                  >
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#334155] flex items-center justify-center text-white text-lg font-serif shadow-sm transform group-hover:scale-105 transition-transform">{b.user?.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="text-sm font-bold text-[#1E293B]">{b.user?.name||'Guest User'}</p>
                          <p className="text-[10px] text-[#E8734A] font-bold uppercase tracking-[0.1em]">{b.service?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-sm font-bold text-[#1E293B]">{new Date(b.booking_date).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})}</p>
                      <p className="text-[11px] text-[#94A3B8] font-medium tracking-widest uppercase">{b.booking_time||'TBD'}</p>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-xs text-[#64748B] max-w-[180px] truncate leading-relaxed" title={b.location}>📍 {b.location || 'Not Specified'}</p>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-base font-bold text-[#1E293B]">₱{parseFloat(b.total_amount).toLocaleString()}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Paid: <span className={b.status === 'paid' ? 'text-emerald-500' : ''}>₱{parseFloat(b.paid_amount||0).toLocaleString()}</span></p>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                           {b.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openNoteModal(b, 'confirmed')}
                                  className="bg-[#DCFCE7] text-[#166534] px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#22C55E] hover:text-white transition-all shadow-sm"
                                >
                                  Confirm (Available)
                                </button>
                                <button
                                  onClick={() => openNoteModal(b, 'rejected')}
                                  className="bg-[#FEE2E2] text-[#991B1B] px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#EF4444] hover:text-white transition-all shadow-sm"
                                >
                                  Reject (Unavailable)
                                </button>
                              </div>
                           )}
                           {b.status === 'approved' && (
                              <button 
                                onClick={() => handleStatusChange(b, 'awaiting_payment')}
                                className="bg-[#FFEDD5] text-[#9A3412] px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#EA580C] hover:text-white transition-all shadow-sm"
                              >
                                Request Payment
                              </button>
                           )}
                            {b.status === 'awaiting_payment' && (
                              <button 
                                onClick={() => handleStatusChange(b, 'paid')}
                                className="bg-[#DCFCE7] text-[#15803D] px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#10B981] hover:text-white transition-all shadow-sm"
                              >
                                Confirm Payment
                              </button>
                           )}
                           <select 
                            value={b.status} 
                            onChange={(e)=>handleStatusChange(b, e.target.value)}
                            className={`text-[9px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl cursor-pointer outline-none transition-all shadow-sm border border-transparent focus:border-[#E8734A] ${getStatusStyle(b.status)}`}
                           >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="awaiting_payment">Wait Payment</option>
                            <option value="paid">Paid</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                            <option value="finished">Finished</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        {b.admin_notes && (
                          <div className="flex items-center gap-2 max-w-[260px] bg-[#F8F9FB] px-4 py-2 rounded-xl border border-[#F1F5F9]">
                             <span className="text-xs">💬</span>
                             <p className="text-[10px] text-[#64748B] text-right leading-relaxed italic">
                               "{b.admin_notes}"
                             </p>
                          </div>
                        )}
                        {b.special_requests && (
                           <div className="group/note relative">
                             <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] cursor-help border-b border-dashed border-[#94A3B8] hover:text-[#E8734A] transition-colors">View Client Brief</span>
                             <div className="absolute right-0 bottom-full mb-3 w-72 p-8 bg-[#1E293B] text-white shadow-2xl rounded-[2rem] opacity-0 group-hover/note:opacity-100 transition-all duration-500 z-50 pointer-events-none scale-95 group-hover/note:scale-100 border border-white/10 backdrop-blur-xl">
                               <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E8734A] mb-4">Service Inquiries</p>
                               <div className="w-8 h-px bg-white/20 mb-4"></div>
                               <p className="text-xs italic leading-relaxed text-[#CBD5E1]">"{b.special_requests}"</p>
                             </div>
                           </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (<tr><td colSpan="5" className="py-32 text-center">
                    <div className="opacity-20 text-6xl mb-6">📸</div>
                    <p className="text-sm font-serif italic text-[#94A3B8]">No sessions scheduled in the registry.</p>
                </td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
