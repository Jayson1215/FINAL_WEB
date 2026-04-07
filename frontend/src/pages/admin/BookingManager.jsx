import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { bookingService } from '../../services/bookingService';

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const previousBookings = [...bookings];
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
      
      await bookingService.updateBookingStatus(bookingId, newStatus);
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const handleProcessRefund = async (bookingId) => {
    if (!window.confirm('Confirm refund processing? This will mark the transaction as refunded in the system.')) return;
    
    try {
      await bookingService.processRefund(bookingId);
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, refund_status: 'refunded' } : b
      ));
    } catch (err) {
      setError('Failed to process refund');
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'finished': return 'text-slate-500 border-slate-500/20 bg-slate-50';
      case 'confirmed': return 'text-emerald-600 border-emerald-600/20 bg-emerald-50';
      case 'cancelled': return 'text-red-500 border-red-500/20 bg-red-50';
      default: return 'text-amber-500 border-amber-500/20 bg-amber-50';
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <AdminLayout title="Manage Bookings">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading bookings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Studio Log">
      {error && (
        <div className="mb-10 p-6 bg-red-50 border-l-2 border-red-200">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">Notice</p>
          <p className="text-sm text-red-800 font-serif italic">{error}</p>
        </div>
      )}

      <div className="space-y-16 animate-fadeIn">
        {/* Editorial Header */}
        <div className="border-b border-[#EEEEEE] pb-10">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-tight mb-4">Client Sessions</h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C79F68]">Orchestrating the schedule and fulfillment of studio reservations.</p>
        </div>

        {/* Bookings Table - Runway Style */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Patron</th>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Schedule</th>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Investment</th>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Accounting</th>
                <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="group hover:bg-[#FAFAFA] transition-all duration-500">
                    <td className="py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 border border-[#EEEEEE] flex items-center justify-center text-[#999] text-xs font-serif group-hover:border-[#C79F68] group-hover:text-[#C79F68] transition-all duration-700">
                          {booking.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-serif text-[#1A1A1A] mb-1">{booking.user?.name || 'Guest'}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C79F68]">{booking.service?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8">
                      <div className="text-[10px] text-[#777] font-medium tracking-widest">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                        <span className="block mt-1 font-bold text-[#1A1A1A]">{booking.booking_time || 'TBD'}</span>
                      </div>
                    </td>
                    <td className="py-8">
                      <div className="space-y-1">
                          <p className="font-serif text-sm text-[#1A1A1A]">₱{parseFloat(booking.total_amount).toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-[#AAA]">Paid: ₱{parseFloat(booking.paid_amount || 0).toLocaleString()}</span>
                          </div>
                      </div>
                    </td>
                    <td className="py-8">
                      {booking.status === 'cancelled' ? (
                        <div className="space-y-2">
                             <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 border ${
                                 booking.refund_status === 'refunded' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                             }`}>
                                 {booking.refund_status === 'requested' ? 'Refund Due' : booking.refund_status}
                             </span>
                             {booking.refund_status === 'requested' && (
                                <button 
                                    onClick={() => handleProcessRefund(booking.id)}
                                    className="block text-[8px] font-bold uppercase tracking-widest text-[#333] border-b border-[#333] hover:text-[#C79F68] transition"
                                >
                                    Fulfill Refund
                                </button>
                             )}
                        </div>
                      ) : (
                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#BBB]">Internal Records</span>
                      )}
                    </td>
                    <td className="py-8 text-right">
                      <div className="flex flex-col items-end gap-3">
                        <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            className={`text-[9px] font-bold uppercase tracking-[0.3em] px-4 py-2 border bg-transparent cursor-pointer transition-all duration-500 outline-none ${getStatusStyle(booking.status)}`}
                        >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="finished">Finished</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        
                        {booking.status === 'cancelled' && booking.cancellation_reason && (
                            <div className="group/note relative">
                                <span className="text-[8px] font-bold uppercase tracking-widest text-[#AAA] cursor-help border-b border-dashed border-[#AAA]">View Reason</span>
                                <div className="absolute right-0 bottom-full mb-4 w-64 p-6 bg-white border border-[#EEEEEE] shadow-premium opacity-0 group-hover/note:opacity-100 transition-opacity z-50 pointer-events-none">
                                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-3">Client Testimony</p>
                                    <p className="text-[10px] text-[#777] italic leading-relaxed">"{booking.cancellation_reason}"</p>
                                </div>
                            </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#BBB]">No sessions currently curated</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
