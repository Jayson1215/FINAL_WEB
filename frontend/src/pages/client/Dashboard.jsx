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
      
      const [bookingsResponse, statsResponse] = await Promise.allSettled([
        bookingService.getMyBookings(),
        paymentService.getReports(),
      ]);

      if (bookingsResponse.status === 'fulfilled') {
        setBookings(bookingsResponse.value.data || []);
      } else {
        setBookings([]);
      }

      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value.data || null);
      } else {
        setStats(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(b => new Date(b.booking_date) > new Date());
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  return (
    <ClientLayout title="Welcome Back">
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
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Intro */}
          <div className="text-center mb-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-4">Account Overview</p>
            <h2 className="text-3xl font-serif text-[#333] mb-6">Manage Your Story</h2>
            <div className="w-12 h-[1px] bg-[#C79F68] mx-auto opacity-40"></div>
          </div>

          {/* Minimalist Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white border border-[#EEEEEE] p-10 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#AAA] mb-4 font-bold">Total Sessions</p>
              <p className="text-5xl font-serif text-[#333] mb-2">{bookings.length}</p>
              <div className="w-6 h-px bg-[#EEEEEE] mx-auto mt-6"></div>
            </div>
            <div className="bg-white border border-[#EEEEEE] p-10 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#AAA] mb-4 font-bold">Confirmed</p>
              <p className="text-5xl font-serif text-[#333] mb-2">{confirmedBookings}</p>
              <div className="w-6 h-px bg-[#EEEEEE] mx-auto mt-6"></div>
            </div>
            <div className="bg-white border border-[#EEEEEE] p-10 text-center">
              <p className="text-[10px] uppercase tracking-widest text-[#AAA] mb-4 font-bold">Pending Approval</p>
              <p className="text-5xl font-serif text-[#333] mb-2">{pendingBookings}</p>
              <div className="w-6 h-px bg-[#EEEEEE] mx-auto mt-6"></div>
            </div>
          </div>

          {/* Action Links (Clean) */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 mb-24 border-y border-[#EEEEEE] py-12">
            <Link to="/client/services" className="group">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#333] group-hover:text-[#C79F68] transition">Book New Session</span>
              <span className="block h-px w-0 group-hover:w-full bg-[#C79F68] transition-all duration-300 mt-1 mx-auto"></span>
            </Link>
            <Link to="/client/portfolio" className="group">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#333] group-hover:text-[#C79F68] transition">Browse Gallery</span>
              <span className="block h-px w-0 group-hover:w-full bg-[#C79F68] transition-all duration-300 mt-1 mx-auto"></span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Upcoming Section */}
            <div className="lg:col-span-12">
                <div className="flex justify-between items-center mb-12">
                    <h3 className="text-2xl font-serif text-[#333]">Upcoming Sessions</h3>
                    <div className="w-24 h-px bg-[#EEEEEE]"></div>
                </div>

                {upcomingBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {upcomingBookings.slice(0, 4).map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white border border-[#EEEEEE] p-10 transition duration-500 hover:shadow-premium"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C79F68]">
                                {booking.status}
                            </span>
                            <span className="text-[11px] font-bold text-[#AAA] tracking-widest">
                                {new Date(booking.booking_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                        <h4 className="text-xl font-serif text-[#333] mb-4">{booking.service?.name}</h4>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777] mb-8">
                           Studio • {booking.booking_time}
                        </p>
                        <Link to={`/client/bookings`} className="text-[10px] font-bold uppercase tracking-widest text-[#333] border-b border-[#333] pb-1 hover:text-[#C79F68] hover:border-[#C79F68] transition">
                            Manage Booking
                        </Link>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center py-20 border border-dashed border-[#EEEEEE]">
                    <p className="text-[10px] uppercase tracking-widest text-[#AAA] font-bold mb-10">No upcoming sessions</p>
                    <Link to="/client/services" className="bg-[#333] text-white py-5 px-10 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#C79F68] transition duration-500">
                        Schedule Your Session
                    </Link>
                </div>
                )}
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
