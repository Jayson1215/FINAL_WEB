import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { paymentService } from '../../services/paymentService';

export default function RevenueReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getReports();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <AdminLayout title="Revenue Reports">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Revenue Reports">
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

      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest">Financial Analytics</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Revenue Reports</h2>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">💰</span>
              <div className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full">Lifetime</div>
            </div>
            <p className="text-amber-100 text-xs font-semibold uppercase tracking-widest mb-2">Total Revenue</p>
            <p className="text-4xl font-bold mb-1">₱{stats?.total_revenue || 0}</p>
            <p className="text-amber-100 text-sm">All earnings</p>
          </div>

          {/* Bookings Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">📅</span>
              <div className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full">Total</div>
            </div>
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-2">All Bookings</p>
            <p className="text-4xl font-bold mb-1">{stats?.total_bookings || 0}</p>
            <p className="text-blue-100 text-sm">Total sessions</p>
          </div>

          {/* Confirmed Bookings Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">✓</span>
              <div className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full">Completed</div>
            </div>
            <p className="text-green-100 text-xs font-semibold uppercase tracking-widest mb-2">Confirmed</p>
            <p className="text-4xl font-bold mb-1">{stats?.confirmed_bookings || 0}</p>
            <p className="text-green-100 text-sm">Completed sessions</p>
          </div>

          {/* Average Per Booking Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">📊</span>
              <div className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full">Average</div>
            </div>
            <p className="text-purple-100 text-xs font-semibold uppercase tracking-widest mb-2">Per Booking</p>
            <p className="text-4xl font-bold mb-1">₱{stats?.total_bookings > 0 ? (stats.total_revenue / stats.total_bookings).toFixed(2) : 0}</p>
            <p className="text-purple-100 text-sm">Session value</p>
          </div>
        </div>

        {/* Revenue Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Revenue Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Total Earned */}
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-3">Total Earned</p>
              <p className="text-3xl font-bold text-slate-900">₱{stats?.total_revenue || 0}</p>
              <p className="text-xs text-slate-500 mt-2">From paid & confirmed</p>
            </div>
            
            {/* Bookings Count */}
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-3">Total Bookings</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.total_bookings || 0}</p>
              <p className="text-xs text-slate-500 mt-2">All sessions</p>
            </div>

            {/* Confirmed Count */}
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-3">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">{stats?.confirmed_bookings || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Completed</p>
            </div>

            {/* Pending */}
            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-3">Pending</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.pending_payments || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Awaiting confirmation</p>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Rate */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Completion Rate</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-600 font-semibold">Sessions Completed</span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.total_bookings > 0 
                      ? ((stats.confirmed_bookings / stats.total_bookings) * 100).toFixed(1) 
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                    style={{width: `${stats?.total_bookings > 0 ? ((stats.confirmed_bookings / stats.total_bookings) * 100) : 0}%`}}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-slate-600 pt-2">
                <p>{stats?.confirmed_bookings} out of {stats?.total_bookings} bookings confirmed</p>
              </div>
            </div>
          </div>

          {/* Average Revenue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Performance Metrics</h3>
            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-6">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-2">Avg Revenue per Session</p>
                <p className="text-3xl font-bold text-amber-600">
                  ₱{stats?.total_bookings > 0 ? (stats.total_revenue / stats.total_bookings).toFixed(2) : 0}
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest mb-2">Pending Confirmations</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.pending_payments || 0} bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
