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
      
      // Make API calls in parallel instead of sequential
      const [bookingsResponse, statsResponse] = await Promise.allSettled([
        bookingService.getMyBookings(),
        paymentService.getReports(),
      ]);

      // Handle bookings response
      if (bookingsResponse.status === 'fulfilled') {
        setBookings(bookingsResponse.value.data || []);
      } else {
        console.error('Failed to fetch bookings:', bookingsResponse.reason);
        setBookings([]);
      }

      // Handle stats response
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value.data || null);
      } else {
        console.error('Failed to fetch stats:', statsResponse.reason);
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
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error Loading Dashboard</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Professional Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 p-12 shadow-2xl shadow-emerald-500/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl -ml-20 -mb-20"></div>
            <div className="relative z-10">
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-3">Welcome Back</p>
              <h1 className="text-5xl font-bold text-white mb-4">Your Studio Dashboard</h1>
              <p className="text-emerald-50 text-lg font-medium max-w-2xl">Manage your photography sessions and bookings</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Bookings */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">📸</span>
                <div className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Total</div>
              </div>
              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Sessions</p>
              <p className="text-4xl font-bold">{bookings.length}</p>
              <p className="text-blue-100 text-sm mt-2">All-time bookings</p>
            </div>

            {/* Confirmed */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">✓</span>
                <div className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Confirmed</div>
              </div>
              <p className="text-green-100 text-xs font-bold uppercase tracking-widest mb-2">Confirmed</p>
              <p className="text-4xl font-bold">{confirmedBookings}</p>
              <p className="text-green-100 text-sm mt-2">Completed sessions</p>
            </div>

            {/* Pending */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">⏳</span>
                <div className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Pending</div>
              </div>
              <p className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-2">Pending</p>
              <p className="text-4xl font-bold">{pendingBookings}</p>
              <p className="text-purple-100 text-sm mt-2">Awaiting confirmation</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/client/services">
              <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-wider text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-3">
                <span className="text-xl">✨</span> Book New Session
              </button>
            </Link>
            <Link to="/client/portfolio">
              <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-300 uppercase tracking-wider text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3">
                <span className="text-xl">🎨</span> View Portfolio
              </button>
            </Link>
          </div>

          {/* Upcoming Sessions */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Sessions</h2>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">
                        {booking.service?.name}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-slate-700 flex items-center gap-3 text-sm">
                          <span className="text-lg">📅</span>
                          <span className="font-semibold">
                            {new Date(booking.booking_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-emerald-600 font-bold">{booking.booking_time}</span>
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
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl bg-white border border-slate-200">
                <span className="text-4xl mb-3 block">📸</span>
                <p className="text-slate-700 text-lg mb-4 font-medium">No upcoming sessions scheduled</p>
                <Link to="/client/services">
                  <button className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition uppercase tracking-wider text-sm">
                    Book Your First Session
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Sessions */}
          {bookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Sessions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {bookings.slice(0, 4).map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {booking.service?.name}
                      </h3>
                      <p className="text-slate-600 text-sm font-medium">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-auto">
                      <span className="text-2xl font-bold text-slate-900">
                        ₱{parseFloat(booking.total_amount || booking.service?.price || 0).toFixed(0)}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}
                      >
                        {booking.status}
                      </span>
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
