import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (e) => {
    e.preventDefault();
    if (!showCancelModal || !cancelReason.trim()) return;

    try {
      setIsSubmitting(true);
      await bookingService.requestCancellation(showCancelModal.id, cancelReason);
      
      // Update local state
      setBookings(bookings.map(b => 
        b.id === showCancelModal.id 
          ? { ...b, status: 'cancelled', refund_status: b.paid_amount > 0 ? 'requested' : 'none', cancellation_reason: cancelReason }
          : b
      ));
      
      setShowCancelModal(null);
      setCancelReason('');
    } catch (err) {
      setError('Failed to request cancellation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canCancelBooking = (booking) => {
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    return booking.status !== 'cancelled' && bookingDate > now;
  };

  const getStatusColor = (status, refundStatus) => {
    if (status === 'cancelled') {
        if (refundStatus === 'refunded') return 'text-emerald-600';
        if (refundStatus === 'requested') return 'text-amber-600';
        return 'text-red-600';
    }
    if (status === 'confirmed') return 'text-emerald-600';
    return 'text-[#AAA]';
  };

  return (
    <ClientLayout title="My Sessions">
      {error && (
        <div className="mb-12 p-6 bg-red-50 border border-red-100 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-red-800 mb-2">Notice</p>
            <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#C79F68] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Subtle Introduction */}
          <div className="text-center mb-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-4">Past & Present</p>
            <h2 className="text-3xl font-serif text-[#333] mb-6">Your Photography History</h2>
            <p className="text-sm text-[#777] max-w-xl mx-auto leading-relaxed">
              Track your upcoming appointments and review your past sessions with us.
            </p>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-8">
              {bookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="bg-white border border-[#EEEEEE] p-12 transition-all duration-500 hover:shadow-premium group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
                    {/* Service & Category */}
                    <div className="md:col-span-1">
                      <p className={`text-[9px] font-bold uppercase tracking-[0.3em] mb-4 ${getStatusColor(booking.status, booking.refund_status)}`}>
                        {booking.status} {booking.refund_status !== 'none' && `(${booking.refund_status})`}
                      </p>
                      <h3 className="text-2xl font-serif text-[#333] mb-2 group-hover:text-[#C79F68] transition">
                        {booking.service?.name}
                      </h3>
                      <p className="text-[10px] text-[#AAA] uppercase tracking-[0.2em] font-bold">
                        {booking.service?.category || 'Session'}
                      </p>
                    </div>

                    {/* Date & Time */}
                    <div className="md:col-span-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#AAA] mb-3">Schedule</p>
                      <p className="text-sm font-bold text-[#333] tracking-[0.1em]">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-[11px] text-[#C79F68] mt-1 font-bold">{booking.booking_time}</p>
                    </div>

                    {/* Amount & Payments */}
                    <div className="md:col-span-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#AAA] mb-3">Investment</p>
                      <div className="space-y-1">
                          <p className="text-xl font-serif text-[#333]">
                            ₱{parseFloat(booking.total_amount || 0).toLocaleString()}
                          </p>
                          <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest text-[#AAA]">
                              <span>Paid: ₱{parseFloat(booking.paid_amount || 0).toLocaleString()}</span>
                              {booking.total_amount > booking.paid_amount && (
                                  <span className="text-amber-600">Due: ₱{parseFloat(booking.total_amount - booking.paid_amount).toLocaleString()}</span>
                              )}
                          </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1 flex flex-col space-y-4">
                        {booking.status !== 'cancelled' && (
                            <Link 
                                to={`/client/booking/${booking.service_id}`}
                                className="bg-[#333] text-white py-4 text-[9px] font-bold uppercase tracking-[0.25em] text-center hover:bg-[#C79F68] transition duration-500"
                            >
                                Re-Schedule
                            </Link>
                        )}
                        {canCancelBooking(booking) && (
                            <button
                                onClick={() => setShowCancelModal(booking)}
                                className="text-[9px] font-bold uppercase tracking-widest text-[#AAA] hover:text-red-600 transition duration-300 border border-[#EEEEEE] py-4"
                            >
                                Request Cancel
                            </button>
                        )}
                        {booking.status === 'cancelled' && booking.refund_status === 'requested' && (
                            <div className="py-4 text-center border border-amber-100 bg-amber-50">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-amber-700">Refund Review</p>
                            </div>
                        )}
                    </div>
                  </div>

                  {/* Cancellation Reason (If applicable) */}
                  {booking.status === 'cancelled' && booking.cancellation_reason && (
                    <div className="mt-12 pt-8 border-t border-[#EEEEEE] bg-[#F9F9F9] p-8">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[#AAA] mb-3">Reason for Cancellation:</p>
                      <p className="text-sm text-[#777] italic leading-relaxed">"{booking.cancellation_reason}"</p>
                    </div>
                  )}

                  {/* Special Requests (Subtle) */}
                  {booking.special_requests && (
                    <div className="mt-12 pt-8 border-t border-[#EEEEEE]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-4 italic">Note from Client:</p>
                      <p className="text-sm text-[#777] italic leading-relaxed">"{booking.special_requests}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-dashed border-[#EEEEEE]">
              <p className="text-[11px] uppercase tracking-widest text-[#AAA] font-bold mb-10">No sessions scheduled yet</p>
              <Link to="/client/services" className="bg-[#333] text-white py-5 px-10 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#C79F68] transition duration-500 shadow-premium">
                Explore Packages
              </Link>
            </div>
          )}
          
          <div className="mt-32 text-center">
            <div className="w-px h-16 bg-[#EEEEEE] mx-auto mb-8"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#AAA] font-bold">
              Captured Moments Last Forever
            </p>
          </div>
        </div>
      )}
      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[100] flex items-center justify-center p-8">
            <div className="bg-white border border-[#EEEEEE] p-12 max-w-lg w-full shadow-premium animate-fadeIn" onClick={e => e.stopPropagation()}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-6">Reservation Reversal</p>
                <h3 className="text-3xl font-serif text-[#333] mb-8">Request Cancellation</h3>
                
                <form onSubmit={handleCancelRequest} className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AAA]">Please provide a reason for the record</label>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            required
                            rows={4}
                            placeholder="Reason for cancellation..."
                            className="w-full bg-[#F9F9F9] border border-[#EEEEEE] p-6 text-sm text-[#333] focus:border-[#C79F68] outline-none transition-all duration-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowCancelModal(null)}
                            className="flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#999] border border-[#EEEEEE] hover:bg-[#F9F9F9] transition"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !cancelReason.trim()}
                            className="flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.25em] text-white bg-[#333] hover:bg-red-600 transition duration-500 disabled:opacity-30"
                        >
                            {isSubmitting ? 'Processing...' : 'Submit Request'}
                        </button>
                    </div>

                    <p className="text-[9px] uppercase tracking-widest text-[#AAA] text-center leading-relaxed">
                        Note: Downpayments are subject to our refund policy. Refunds are typically processed within 5-7 business days after approval.
                    </p>
                </form>
            </div>
        </div>
      )}
    </ClientLayout>
  );
}
