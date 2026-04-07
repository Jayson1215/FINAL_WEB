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
    <AdminLayout title="Studio Overview">
      {error && (
        <div className="mb-10 p-6 bg-red-50 border-l-2 border-red-200">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">System Notice</p>
          <p className="text-sm text-red-800 font-serif italic">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 text-[10px] font-bold uppercase tracking-widest text-red-600 border-b border-red-600 pb-0.5 hover:opacity-70 transition"
          >
            Retry Connection
          </button>
        </div>
      )}

      <div className="space-y-16 animate-fadeIn">
        {/* Editorial Welcome Section */}
        <div className="relative py-12 px-2 border-b border-[#EEEEEE]">
          <span className="absolute -top-4 left-0 text-[80px] font-serif text-[#F0F0F0] select-none opacity-50 z-0">Overview</span>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-tight mb-4">Good day, Studio Manager.</h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C79F68]">Curating your studio's performance and bookings.</p>
          </div>
        </div>

        {/* Premium Stats Grid - Balanced and Precise */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#EEEEEE] divide-y md:divide-y-0 md:divide-x divide-[#EEEEEE]">
          {/* Revenue Card */}
          <div className="bg-white p-10 group hover:bg-[#F9F9F9] transition-all duration-700">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8">Total Revenue</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] text-[#C79F68] font-serif">₱</span>
              <span className="text-4xl font-serif text-[#1A1A1A]">{(stats?.total_revenue || 0).toLocaleString()}</span>
            </div>
            <div className="w-6 h-px bg-[#C79F68] mt-6 transition-all duration-700 group-hover:w-12"></div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white p-10 group hover:bg-[#F9F9F9] transition-all duration-700">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8">Total Sessions</p>
            <span className="text-4xl font-serif text-[#1A1A1A]">{stats?.total_bookings || 0}</span>
            <div className="w-6 h-px bg-[#C79F68] mt-6 transition-all duration-700 group-hover:w-12"></div>
          </div>

          {/* Confirmed Card */}
          <div className="bg-white p-10 group hover:bg-[#F9F9F9] transition-all duration-700">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8">Confirmed</p>
            <span className="text-4xl font-serif text-[#1A1A1A]">{stats?.confirmed_bookings || 0}</span>
            <div className="w-6 h-px bg-[#C79F68] mt-6 transition-all duration-700 group-hover:w-12"></div>
          </div>

          {/* Pending Card */}
          <div className="bg-white p-10 group hover:bg-[#F9F9F9] transition-all duration-700">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8">Pending</p>
            <span className="text-4xl font-serif text-[#1A1A1A]">{stats?.pending_payments || 0}</span>
            <div className="w-6 h-px bg-[#C79F68] mt-6 transition-all duration-700 group-hover:w-12"></div>
          </div>
        </div>

        {/* Recent Activity - Runway Style Table */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-6">
            <div>
              <h3 className="text-2xl font-serif text-[#1A1A1A]">Recent Activity</h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mt-2">The latest studio reservations</p>
            </div>
            <button className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C79F68] border-b border-[#C79F68] pb-1 hover:opacity-70 transition">View All Bookings</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Client</th>
                  <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Service</th>
                  <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Schedule</th>
                  <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Investment</th>
                  <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="group hover:bg-[#FAFAFA] transition-all duration-500">
                      <td className="py-8">
                        <div>
                          <p className="text-sm font-serif text-[#1A1A1A] mb-1">{booking.user?.name || 'Guest'}</p>
                          <p className="text-[10px] text-[#AAA] tracking-widest">{booking.user?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777] group-hover:text-[#1A1A1A] transition-colors">{booking.service?.name || 'Custom Session'}</span>
                      </td>
                      <td className="py-8">
                        <div className="text-[10px] text-[#777] font-medium tracking-widest">
                          {new Date(booking.booking_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                          <span className="mx-2 opacity-30">|</span>
                          {booking.booking_time || 'TBD'}
                        </div>
                      </td>
                      <td className="py-8 font-serif text-sm text-[#1A1A1A]">
                        ₱{(booking.total_amount || 0).toLocaleString()}
                      </td>
                      <td className="py-8 text-right">
                        <span className={`text-[8px] font-bold uppercase tracking-[0.4em] px-3 py-1.5 border ${
                          booking.status === 'finished'
                            ? 'bg-slate-50 text-slate-500 border-slate-100'
                            : booking.status === 'confirmed'
                            ? 'bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]'
                            : booking.status === 'pending'
                            ? 'bg-[#FFFBEB] text-[#92400E] border-[#FEF3C7]'
                            : 'bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#BBB]">No active curation found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Metrics - Sophisticated Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-[#EEEEEE]">
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Studio Yield</p>
            <p className="text-2xl font-serif text-[#1A1A1A]">
              ₱{stats?.total_bookings > 0 ? Math.round((stats?.total_revenue || 0) / stats?.total_bookings).toLocaleString() : 0}
              <span className="text-[10px] text-[#BBB] uppercase tracking-widest font-sans ml-3">/ avg</span>
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Fulfilment</p>
            <p className="text-2xl font-serif text-[#1A1A1A]">
              {stats?.total_bookings > 0 ? Math.round((stats?.confirmed_bookings / stats?.total_bookings) * 100) : 0}%
              <span className="text-[10px] text-[#BBB] uppercase tracking-widest font-sans ml-3">efficiency</span>
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Pending Liquidity</p>
            <p className="text-2xl font-serif text-[#1A1A1A]">
              ₱{((stats?.total_bookings - stats?.confirmed_bookings) * 250 || 0).toLocaleString()}
              <span className="text-[10px] text-[#BBB] uppercase tracking-widest font-sans ml-3">projected</span>
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

