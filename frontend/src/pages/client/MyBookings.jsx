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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your bookings...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Professional Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-purple-400 to-purple-600 p-12 shadow-2xl shadow-purple-500/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl -ml-20 -mb-20"></div>
            <div className="relative z-10">
              <p className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-3">Session Management</p>
              <h1 className="text-5xl font-bold text-white mb-4">My Bookings</h1>
              <p className="text-purple-50 text-lg font-medium max-w-2xl">Manage and track all your photography sessions</p>
            </div>
          </div>

          {bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                      {/* Service */}
                      <div>
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Service</p>
                        <h3 className="text-lg font-bold text-slate-900">
                          {booking.service?.name}
                        </h3>
                        {booking.service?.category && (
                          <p className="text-xs text-slate-500 mt-2">{booking.service.category}</p>
                        )}
                      </div>

                      {/* Date & Time */}
                      <div>
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Date & Time</p>
                        <p className="text-lg font-bold text-slate-900">
                          {new Date(booking.booking_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-slate-600 font-semibold text-sm mt-1">{booking.booking_time}</p>
                      </div>

                      {/* Amount */}
                      <div>
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Amount</p>
                        <p className="text-3xl font-bold text-purple-600">
                          ₱{parseFloat(booking.total_amount || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Status</p>
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : booking.status === 'cancelled' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                      <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Special Requests</p>
                        <p className="text-slate-800 font-medium">{booking.special_requests}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {canCancelBooking(booking) && (
                      <div className="flex gap-3 pt-6 border-t border-slate-200">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm uppercase tracking-wider transition"
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
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <span className="text-5xl mb-4 block">📸</span>
              <p className="text-slate-700 text-lg mb-8 font-medium">You haven't booked any sessions yet</p>
              <Link to="/client/services">
                <button className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition shadow-lg shadow-purple-600/30">
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
