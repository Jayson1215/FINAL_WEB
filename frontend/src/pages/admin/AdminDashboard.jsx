import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { paymentService } from '../../services/paymentService';
import { bookingService } from '../../services/bookingService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsResponse, bookingsResponse] = await Promise.allSettled([
        paymentService.getReports(),
        bookingService.getAllBookings(),
      ]);

      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value.data);
      } else {
        console.error('Failed to fetch reports:', statsResponse.reason);
        setStats({
          total_revenue: 0,
          total_bookings: 0,
          confirmed_bookings: 0,
          pending_payments: 0,
        });
      }

      if (bookingsResponse.status === 'fulfilled') {
        setRecentBookings((bookingsResponse.value.data || []).slice(0, 8));
      } else {
        console.error('Failed to fetch bookings:', bookingsResponse.reason);
        setRecentBookings([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
      setStats({
        total_revenue: 0,
        total_bookings: 0,
        confirmed_bookings: 0,
        pending_payments: 0,
      });
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading your studio data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error Loading Data</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back to your studio!</h2>
          <p className="text-slate-600">Monitor your bookings, revenue, and manage your photography services in real-time.</p>
        </div>

        {/* Stats Grid - Premium Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-amber-100 text-sm font-semibold uppercase tracking-widest mb-2">Total Revenue</p>
                <p className="text-4xl font-bold">₱{(stats?.total_revenue || 0).toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                💰
              </div>
            </div>
            <p className="text-amber-100 text-sm">From confirmed bookings & payments</p>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-widest mb-2">Total Bookings</p>
                <p className="text-4xl font-bold">{stats?.total_bookings || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                📅
              </div>
            </div>
            <p className="text-blue-100 text-sm">All time bookings</p>
          </div>

          {/* Confirmed Bookings Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg shadow-green-500/20 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-green-100 text-sm font-semibold uppercase tracking-widest mb-2">Confirmed</p>
                <p className="text-4xl font-bold">{stats?.confirmed_bookings || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                ✓
              </div>
            </div>
            <p className="text-green-100 text-sm">Ready for session</p>
          </div>

          {/* Pending Payments Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-purple-100 text-sm font-semibold uppercase tracking-widest mb-2">Pending</p>
                <p className="text-4xl font-bold">{stats?.pending_payments || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                ⏳
              </div>
            </div>
            <p className="text-purple-100 text-sm">Awaiting payment</p>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="text-2xl">📸</span>
              Recent Bookings
            </h3>
            <p className="text-slate-400 text-sm mt-1">Latest photoshoot reservations and sessions</p>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Client</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Service</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Time</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors duration-200 group">
                      <td className="px-8 py-5 text-sm">
                        <div>
                          <p className="font-semibold text-slate-900">{booking.user?.name || 'N/A'}</p>
                          <p className="text-xs text-slate-500">{booking.user?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-700 font-medium">{booking.service?.name || 'N/A'}</td>
                      <td className="px-8 py-5 text-sm text-slate-700">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-700">{booking.booking_time || '-'}</td>
                      <td className="px-8 py-5 text-sm font-bold text-amber-600">₱{booking.total_amount}</td>
                      <td className="px-8 py-5 text-sm">
                        <span className={`inline-flex px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {booking.status === 'confirmed' && '✓ '}
                          {booking.status === 'pending' && '⏳ '}
                          {booking.status === 'cancelled' && '✕ '}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">📭</span>
                        <p className="text-slate-600 font-medium">No bookings yet</p>
                        <p className="text-slate-500 text-sm">Your booking history will appear here</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <p className="text-slate-600 text-sm">Average Booking</p>
              <p className="text-2xl font-bold text-slate-900">
                ₱{stats?.total_bookings > 0 ? Math.round((stats?.total_revenue || 0) / stats?.total_bookings) : 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">
              📈
            </div>
            <div>
              <p className="text-slate-600 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats?.total_bookings > 0 ? Math.round((stats?.confirmed_bookings / stats?.total_bookings) * 100) : 0}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
              💳
            </div>
            <div>
              <p className="text-slate-600 text-sm">Pending Revenue</p>
              <p className="text-2xl font-bold text-slate-900">₱{((stats?.total_bookings - stats?.confirmed_bookings) * 250 || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

