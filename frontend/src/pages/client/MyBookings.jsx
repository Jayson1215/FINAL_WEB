import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [highlightedBookingId, setHighlightedBookingId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchBookings();
  }, []);

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
    }, 250);

    const clearTimer = setTimeout(() => setHighlightedBookingId(''), 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(clearTimer);
    };
  }, [loading, location.search]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const handlePayNow = (booking) => {
    // For now, redirect to a checkout page with the booking ID
    // We'll simulate a payment flow here
    navigate(`/client/checkout`, { state: { booking } });
  };

  const canCancelBooking = (booking) => {
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    return (booking.status === 'pending' || booking.status === 'approved') && bookingDate > now;
  };

  const getServiceImageUrl = (service) => resolveServiceImageUrl(service);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
      case 'confirmed':
        return { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' };
      case 'awaiting_payment': return { label: 'Payment Required', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500' };
      case 'paid': return { label: 'Confirmed & Paid', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' };
      case 'rejected': return { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' };
      case 'cancelled': return { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' };
      case 'finished': return { label: 'Finished', bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100', dot: 'bg-sky-500' };
      case 'pending':
      default: return { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' };
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <ClientLayout title="My Bookings">
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Your Registry">
      {error && (<div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center shadow-sm">{error}</div>)}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-[#1E293B]/95 backdrop-blur-xl z-[150] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedReceipt(null)}>
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/20 animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E8734A] to-[#FB923C]"></div>
            <button onClick={() => setSelectedReceipt(null)} className="absolute top-8 right-8 text-[#94A3B8] hover:text-[#1E293B] transition-colors bg-[#F8F9FB] w-10 h-10 rounded-full flex items-center justify-center shadow-sm">✕</button>
            
            <div className="p-12 space-y-10">
              <div className="text-center space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E8734A]">LIGHT PHOTOGRAPHY</p>
                <h3 className="text-3xl font-serif text-[#1E293B]">Session Receipt</h3>
                <div className="w-12 h-[2px] bg-[#F1F5F9] mx-auto mt-4"></div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-[#F1F5F9]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Package</span>
                  <span className="text-sm font-bold text-[#1E293B]">{selectedReceipt.service?.name}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[#F1F5F9]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Schedule</span>
                  <span className="text-sm font-bold text-[#1E293B]">{new Date(selectedReceipt.booking_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-[#F1F5F9]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Location</span>
                  <span className="text-sm font-bold text-[#1E293B] truncate max-w-[200px]">{selectedReceipt.location || 'N/A'}</span>
                </div>
              </div>

              <div className="bg-[#F8F9FB] rounded-[2rem] p-8 space-y-4 border border-[#F1F5F9]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Investment</span>
                  <span className="text-sm font-bold text-[#1E293B]">₱{parseFloat(selectedReceipt.total_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Paid Amount</span>
                  <span className="text-sm font-bold text-emerald-500">₱{parseFloat(selectedReceipt.paid_amount || 0).toLocaleString()}</span>
                </div>
                <div className="h-px bg-[#E2E8F0] my-2"></div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1E293B]">Balance</span>
                  <span className="text-2xl font-serif font-bold text-[#E8734A]">₱{(parseFloat(selectedReceipt.total_amount) - parseFloat(selectedReceipt.paid_amount || 0)).toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center pt-4">
                <button onClick={() => window.print()} className="bg-[#1E293B] text-white px-12 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#E8734A] hover:shadow-2xl transition-all shadow-lg">Print Manifest</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-12 animate-fadeIn">
        {!loading && bookings.length > 0 && (
          <div className="flex justify-end mb-4">
             <Link to="/client/services">
              <button className="bg-gradient-to-r from-[#E8734A] to-[#FB923C] text-white px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:shadow-2xl hover:translate-y-[-2px] transition-all shadow-xl">
                + New Request
              </button>
            </Link>
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-12">
            {bookings.map((booking) => {
              const serviceImageUrl = getServiceImageUrl(booking.service);
              const status = getStatusConfig(booking.status);
              const bookingDate = new Date(booking.booking_date);
              
              return (
                <div
                  key={booking.id}
                  data-booking-id={booking.id}
                  className={`group rounded-[3rem] shadow-premium hover:shadow-card-hover border overflow-hidden transition-all duration-1000 ${highlightedBookingId === booking.id ? 'bg-[#FFF7ED] border-[#FDBA74] ring-8 ring-[#FB923C]/10 shadow-2xl scale-[1.01] z-10' : 'bg-white border-[#F1F5F9]'}`}
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Area */}
                    <div className="w-full lg:w-[400px] relative h-80 lg:h-auto bg-[#F8F9FB] overflow-hidden">
                      {serviceImageUrl ? (
                        <img src={serviceImageUrl} alt={booking.service?.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#E2E8F0]">
                          <span className="text-6xl mb-4">📸</span>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Masterpiece Placeholder</p>
                        </div>
                      )}
                      <div className="absolute top-8 left-8">
                        <span className="px-6 py-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E293B] border border-[#F1F5F9]">
                          {booking.service?.category || 'Editorial'}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-10 md:p-16 flex flex-col">
                      <div className="flex flex-wrap items-start justify-between gap-8 mb-12">
                        <div className="space-y-4">
                          <p className="text-[#E8734A] text-[11px] font-bold uppercase tracking-[0.4em] flex items-center gap-3">
                             <span className="w-1.5 h-1.5 bg-[#E8734A] rounded-full animate-ping"></span> Active Selection
                          </p>
                          <h3 className="text-4xl font-serif text-[#1E293B] leading-tight">{booking.service?.name || 'Photography Session'}</h3>
                        </div>
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${status.bg} ${status.text} ${status.border} shadow-sm transition-all duration-500`}>
                          <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`}></span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{status.label}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                        <div className="space-y-3">
                          <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[0.3em]">Schedule</p>
                          <p className="text-[#1E293B] font-bold text-base">
                            {bookingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} <br />
                            <span className="text-[#E8734A] text-sm tracking-widest">{booking.booking_time}</span>
                          </p>
                        </div>
                        <div className="space-y-3 col-span-2">
                          <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[0.3em]">Venue Location</p>
                          <p className="text-[#1E293B] font-bold text-base leading-relaxed">
                            📍 {booking.location || 'Consulting Venues'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-[#F8F9FB] border border-[#F1F5F9] rounded-[2rem] p-8 group-hover:bg-white transition-all duration-500">
                          <p className="text-[#E8734A] text-[10px] font-bold uppercase tracking-[0.3em] mb-3">Investment</p>
                          <p className="text-3xl font-serif text-[#1E293B] font-bold">₱{parseFloat(booking.total_amount || 0).toLocaleString()}</p>
                        </div>
                         {booking.special_requests && (
                          <div className="p-8 bg-[#F8F9FB] rounded-[2rem] border-l-4 border-[#E8734A] flex flex-col justify-center">
                            <p className="text-[#1E293B] text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Client Narrative</p>
                            <p className="text-[#64748B] text-sm italic font-medium leading-relaxed">"{booking.special_requests}"</p>
                          </div>
                        )}
                      </div>

                      {booking.admin_notes && (
                        <div className="mb-10 bg-white border border-[#E2E8F0] rounded-2xl px-6 py-5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] mb-2">Admin Notes</p>
                          <p className="text-sm text-[#1E293B] leading-relaxed">{booking.admin_notes}</p>
                        </div>
                      )}

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-[#F1F5F9]">
                        <p className="text-[10px] text-[#94A3B8] font-bold tracking-[0.4em] uppercase">REF_ID: {booking.id.split('-')[0].toUpperCase()}</p>
                        <div className="flex gap-4">
                           {canCancelBooking(booking) && (
                              <button onClick={() => handleCancelBooking(booking.id)} className="px-8 py-4 text-rose-500 hover:bg-rose-50 border border-rose-100 rounded-2xl font-bold transition-all text-[10px] uppercase tracking-[0.2em]">
                                Cancel Request
                              </button>
                           )}
                           {booking.status === 'awaiting_payment' && (
                              <button onClick={() => handlePayNow(booking)} className="px-10 py-4 bg-[#E8734A] text-white rounded-2xl font-bold transition-all text-[10px] uppercase tracking-[0.3em] shadow-lg hover:shadow-2xl hover:translate-y-[-2px] animate-pulse">
                                Proceed to Payment
                              </button>
                           )}
                           <button onClick={() => setSelectedReceipt(booking)} className="px-10 py-4 bg-[#1E293B] text-white rounded-2xl font-bold transition-all text-[10px] uppercase tracking-[0.3em] shadow-lg hover:shadow-2xl hover:translate-y-[-1px]">
                             Review Receipt
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border border-[#F1F5F9] shadow-premium">
            <div className="w-24 h-24 bg-[#F0F2F5] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-4xl opacity-40">📸</div>
            <h3 className="text-2xl text-[#1E293B] mb-8 font-serif">Your registry is currently empty.</h3>
            <Link to="/client/services">
              <button className="bg-gradient-to-r from-[#E8734A] to-[#FB923C] text-white px-12 py-6 rounded-2xl font-bold uppercase tracking-[0.4em] hover:shadow-2xl transition shadow-xl text-[11px]">
                ✨ Explore Collections
              </button>
            </Link>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
