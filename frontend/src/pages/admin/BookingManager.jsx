import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { bookingService } from '../../services/bookingService';

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchBookings(); }, []);
  const fetchBookings = async () => { try { setLoading(true); const r = await bookingService.getAllBookings(); setBookings(r.data); } catch(e){ setError('Failed to load bookings'); } finally { setLoading(false); } };

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
    } catch (e) {
      setBookings(previous);
      setError('Failed to update status');
    }
  };

  const handleDecisionWithNotes = (booking, nextStatus) => {
    const adminNotes = window.prompt('Optional admin note for the client:', booking.admin_notes || '');
    if (adminNotes === null) return;
    handleStatusChange(booking, nextStatus, adminNotes);
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
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div><h2 className="text-2xl font-bold text-[#1E293B] mb-1">On-Call Requests</h2><p className="text-sm text-[#94A3B8]">Review and manage incoming photography service requests.</p></div>
          <div className="flex gap-3">
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#F1F5F9] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B]">New Workflow Active</span>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-[#F1F5F9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8F9FB] border-b border-[#F1F5F9]">
                <tr>
                  {['Client','Schedule','Location','Investment','Status & Action'].map(h=>(
                    <th key={h} className={`px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] ${h.includes('Status')?'text-right':''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8F9FB]">
                {bookings.length>0 ? bookings.map(b=>(
                  <tr key={b.id} className="hover:bg-[#FAFBFC] transition-colors group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#334155] flex items-center justify-center text-white text-base font-serif shadow-sm">{b.user?.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="text-sm font-bold text-[#1E293B]">{b.user?.name||'Guest User'}</p>
                          <p className="text-[10px] text-[#E8734A] font-bold uppercase tracking-[0.1em]">{b.service?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-bold text-[#1E293B]">{new Date(b.booking_date).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})}</p>
                      <p className="text-[11px] text-[#94A3B8] font-medium tracking-widest uppercase">{b.booking_time||'TBD'}</p>
                    </td>
                    <td className="px-6 py-6">
                       <p className="text-xs text-[#64748B] max-w-[150px] truncate leading-relaxed" title={b.location}>📍 {b.location || 'Not Specified'}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-base font-bold text-[#1E293B]">₱{parseFloat(b.total_amount).toLocaleString()}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Paid: <span className={b.status === 'paid' ? 'text-emerald-500' : ''}>₱{parseFloat(b.paid_amount||0).toLocaleString()}</span></p>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                           {b.status === 'pending' && (
                              <button
                                onClick={() => handleDecisionWithNotes(b, 'confirmed')}
                                className="bg-[#DCFCE7] text-[#166534] px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#22C55E] hover:text-white transition-all shadow-sm"
                              >
                                Confirm (Available)
                              </button>
                           )}
                           {b.status === 'pending' && (
                              <button
                                onClick={() => handleDecisionWithNotes(b, 'rejected')}
                                className="bg-[#FEE2E2] text-[#991B1B] px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#EF4444] hover:text-white transition-all shadow-sm"
                              >
                                Reject (Unavailable)
                              </button>
                           )}
                           {b.status === 'approved' && (
                              <button 
                                onClick={() => handleStatusChange(b, 'awaiting_payment')}
                                className="bg-[#FFEDD5] text-[#9A3412] px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#EA580C] hover:text-white transition-all shadow-sm"
                              >
                                Request Payment
                              </button>
                           )}
                            {b.status === 'awaiting_payment' && (
                              <button 
                                onClick={() => handleStatusChange(b, 'paid')}
                                className="bg-[#DCFCE7] text-[#15803D] px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#10B981] hover:text-white transition-all shadow-sm"
                              >
                                Confirm Payment
                              </button>
                           )}
                           <select value={b.status} onChange={(e)=>handleStatusChange(b, e.target.value)}
                            className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer outline-none transition-all shadow-sm border border-transparent focus:border-[#E8734A] ${getStatusStyle(b.status)}`}>
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
                          <p className="text-[10px] text-[#64748B] max-w-[260px] text-right leading-relaxed">
                            Note: {b.admin_notes}
                          </p>
                        )}
                        {b.special_requests && (
                           <div className="group/note relative">
                             <span className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] cursor-help border-b border-dashed border-[#94A3B8] hover:text-[#E8734A] transition-colors">View Client Brief</span>
                             <div className="absolute right-0 bottom-full mb-3 w-64 p-6 bg-[#1E293B] text-white shadow-2xl rounded-[1.5rem] opacity-0 group-hover/note:opacity-100 transition-all duration-500 z-50 pointer-events-none scale-95 group-hover/note:scale-100">
                               <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E8734A] mb-3">Service Inquiries</p>
                               <p className="text-xs italic leading-relaxed text-[#CBD5E1]">"{b.special_requests}"</p>
                             </div>
                           </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (<tr><td colSpan="5" className="py-24 text-center">
                    <div className="opacity-20 text-5xl mb-4">📸</div>
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
