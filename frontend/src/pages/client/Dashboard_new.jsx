import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';

export default function ClientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      let bookingsResponse, statsResponse;
      
      try {
        bookingsResponse = await bookingService.getMyBookings();
        setBookings(bookingsResponse.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setBookings([]);
      }

      try {
        statsResponse = await paymentService.getReports();
        setStats(statsResponse.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setStats(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please refresh the page.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => new Date(b.booking_date) > new Date());
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  return (
    <ClientLayout title="Dashboard">
      {error && (
        <div className="bg-red-100 border-2 border-red-300 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
          <p className="font-semibold">⚠️ Error Loading Dashboard</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-700 text-lg">Loading your studio...</div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Elegant Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-12 shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">Welcome Back</p>
              <h1 className="text-6xl font-display font-bold text-white mb-3">Your Studio Dashboard</h1>
              <p className="text-slate-300 text-lg">Manage your photography sessions with elegance</p>
            </div>
          </div>

          {/* Elegant Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Bookings */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
                    <span className="text-2xl">📸</span>
                  </div>
                  <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Total Sessions</p>
                </div>
                <p className="text-5xl font-display font-bold text-slate-900 mb-3">{bookings.length}</p>
                <div className="h-1.5 w-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
              </div>
            </div>

            {/* Confirmed */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition">
                    <span className="text-2xl">✓</span>
                  </div>
                  <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Confirmed</p>
                </div>
                <p className="text-5xl font-display font-bold text-emerald-700 mb-3">{confirmedBookings}</p>
                <div className="h-1.5 w-16 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
              </div>
            </div>

            {/* Pending */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Pending</p>
                </div>
                <p className="text-5xl font-display font-bold text-amber-700 mb-3">{pendingBookings}</p>
                <div className="h-1.5 w-16 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Elegant Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/client/services" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-1 shadow-lg hover:shadow-xl transition-all duration-300">
                <button className="w-full relative z-10 bg-white text-slate-900 py-5 px-8 rounded-xl font-display font-bold uppercase tracking-widest group-hover:bg-slate-50 transition-all duration-300 text-sm flex items-center justify-center gap-3">
                  <span className="text-xl">✨</span> Book New Session
                </button>
              </div>
            </Link>
            <Link to="/client/portfolio" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-1 shadow-lg hover:shadow-xl transition-all duration-300">
                <button className="w-full relative z-10 bg-white text-emerald-700 py-5 px-8 rounded-xl font-display font-bold uppercase tracking-widest group-hover:bg-slate-50 transition-all duration-300 text-sm flex items-center justify-center gap-3">
                  <span className="text-xl">🎨</span> View Portfolio
                </button>
              </div>
            </Link>
          </div>

          {/* Elegant Upcoming Sessions */}
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">Upcoming Sessions</h2>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-5">
                {upcomingBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition">
                          {booking.service?.name}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-slate-700 flex items-center gap-3">
                            <span className="text-lg">📅</span>
                            <span className="font-medium">
                              {new Date(booking.booking_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                            <span className="text-emerald-600 font-semibold">{booking.booking_time}</span>
                          </p>
                          {booking.special_requests && (
                            <p className="text-slate-600 text-sm flex items-center gap-3">
                              <span>📝</span>
                              {booking.special_requests}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap ml-4 border ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-slate-700 text-lg mb-4 font-medium">No upcoming sessions scheduled</p>
                <Link to="/client/services">
                  <button className="inline-block px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition uppercase tracking-wider text-sm mt-4">
                    Book Your First Session
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Elegant Recent Sessions */}
          {bookings.length > 0 && (
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-8">Recent Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {bookings.slice(0, 4).map((booking) => (
                  <div
                    key={booking.id}
                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <h3 className="text-lg font-display font-bold text-slate-900 group-hover:text-blue-700 transition">
                          {booking.service?.name}
                        </h3>
                        <span className="text-3xl opacity-15 group-hover:opacity-25 transition">📸</span>
                      </div>
                      <p className="text-slate-600 text-sm font-medium mb-4">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <span className="text-2xl font-display font-bold text-slate-900">
                          ${booking.service?.price || '0.00'}
                        </span>
                        <span
                          className={`text-xs font-bold uppercase px-4 py-2 rounded-lg tracking-wider border ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
}
