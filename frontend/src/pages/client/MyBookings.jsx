import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      setError('Failed to cancel booking');
      console.error(err);
    }
  };

  const canCancelBooking = (booking) => {
    const bookingDate = new Date(booking.booking_date);
    const now = new Date();
    return booking.status !== 'cancelled' && bookingDate > now;
  };

  return (
    <ClientLayout title="My Bookings">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-700 text-lg">Loading your bookings...</div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Elegant Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-12 shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-2">Booking Management</p>
              <h1 className="text-6xl font-display font-bold text-white mb-3">My Bookings</h1>
              <p className="text-slate-300 text-lg">View and manage your photography sessions</p>
            </div>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-purple-200 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                      {/* Service */}
                      <div>
                        <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-3">Service</p>
                        <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-purple-700 transition">
                          {booking.service?.name}
                        </h3>
                      </div>

                      {/* Date & Time */}
                      <div>
                        <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-3">Date & Time</p>
                        <p className="text-slate-900 font-bold text-lg">
                          {new Date(booking.booking_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-slate-600 font-medium">{booking.booking_time}</p>
                      </div>

                      {/* Amount */}
                      <div>
                        <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-3">Amount</p>
                        <p className="text-3xl font-display font-bold text-purple-600">
                          ${booking.total_amount}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-3">Status</p>
                        <span
                          className={`inline-block px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap border ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                      <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-2">Special Requests</p>
                        <p className="text-slate-800 font-medium">{booking.special_requests}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {canCancelBooking(booking) && (
                      <div className="flex gap-3 pt-6 border-t border-slate-200">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-8 py-3 bg-red-100 text-red-700 border border-red-300 rounded-lg hover:bg-red-200 hover:border-red-400 font-bold transition text-sm uppercase tracking-wider"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-700 text-lg mb-8 font-medium">You haven't booked any sessions yet.</p>
              <Link to="/client/services">
                <button className="inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-display font-bold uppercase tracking-wider hover:bg-slate-800 transition shadow-lg hover:shadow-xl">
                  ✨ Book Your First Session
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
}
