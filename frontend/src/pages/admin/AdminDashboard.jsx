import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { paymentService } from '../../services/paymentService';
import { bookingService } from '../../services/bookingService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true); setError('');
      const [sr, br] = await Promise.allSettled([paymentService.getReports(), bookingService.getAllBookings()]);
      setStats(sr.status === 'fulfilled' ? sr.value.data : { total_revenue:0, total_bookings:0, confirmed_bookings:0, pending_payments:0 });
      setRecentBookings(br.status === 'fulfilled' ? (br.value.data || []).slice(0,8) : []);
    } catch (err) { setError('Failed to load dashboard'); setStats({ total_revenue:0, total_bookings:0, confirmed_bookings:0, pending_payments:0 }); setRecentBookings([]); }
    finally { setLoading(false); }
  };

  if (loading) return (<AdminLayout title="Dashboard"><div className="flex justify-center items-center h-96"><div className="text-center"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto mb-4"></div><p className="text-[#64748B]">Loading studio data...</p></div></div></AdminLayout>);

  const statCards = [
    { label:'Total Revenue', value:`₱${(stats?.total_revenue||0).toLocaleString()}`, gradient:'from-[#E8734A] to-[#FB923C]', bg:'bg-[#FFF7ED]', text:'text-[#E8734A]' },
    { label:'Total Sessions', value:stats?.total_bookings||0, gradient:'from-[#6366F1] to-[#8B5CF6]', bg:'bg-[#EEF2FF]', text:'text-[#6366F1]' },
    { label:'Confirmed', value:stats?.confirmed_bookings||0, gradient:'from-[#10B981] to-[#34D399]', bg:'bg-[#ECFDF5]', text:'text-[#10B981]' },
    { label:'Pending', value:stats?.pending_payments||0, gradient:'from-[#F59E0B] to-[#FBBF24]', bg:'bg-[#FFFBEB]', text:'text-[#F59E0B]' },
  ];

  return (
    <AdminLayout title="Studio Overview">
      {error && (<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"><p className="text-xs font-semibold text-red-600 mb-1">Error</p><p className="text-sm text-red-500">{error}</p><button onClick={fetchDashboardData} className="mt-2 text-xs font-semibold text-red-600 underline">Retry</button></div>)}
      <div className="space-y-8 animate-fadeIn">
        {/* Welcome */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-2xl p-8 md:p-10 shadow-lg">
          <div className="absolute top-[-50px] right-[-30px] w-[200px] h-[200px] bg-[#E8734A]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-50px] left-[-30px] w-[180px] h-[180px] bg-[#6366F1]/15 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#E8734A] mb-2">Welcome Back</p>
            <h2 className="text-3xl font-serif text-white leading-tight mb-2">Good day, Studio Manager.</h2>
            <p className="text-sm text-white/60">Here's what's happening with your studio today.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((s,i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-[#F1F5F9] group">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">{s.label}</p>
                <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${s.gradient}`}></div>
                </div>
              </div>
              <span className={`text-3xl font-bold ${s.text}`}>{s.value}</span>
              <div className={`w-full h-1 ${s.bg} rounded-full mt-4`}>
                <div className={`h-1 rounded-full bg-gradient-to-r ${s.gradient} w-3/4 group-hover:w-full transition-all duration-700`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-card border border-[#F1F5F9] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
            <div>
              <h3 className="text-lg font-bold text-[#1E293B]">Recent Activity</h3>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mt-0.5">Latest reservations</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8F9FB]">
                <tr>
                  {['Client','Service','Schedule','Amount','Status'].map(h => (
                    <th key={h} className={`px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] ${h==='Status'?'text-right':''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#F8F9FB] hover:bg-[#FAFBFC] transition-colors">
                    <td className="px-6 py-4"><p className="text-sm font-semibold text-[#1E293B]">{b.user?.name||'Guest'}</p><p className="text-[10px] text-[#94A3B8]">{b.user?.email||'N/A'}</p></td>
                    <td className="px-6 py-4"><span className="text-[10px] font-semibold uppercase tracking-wider text-[#6366F1] bg-[#EEF2FF] px-2.5 py-1 rounded-md">{b.service?.name||'Session'}</span></td>
                    <td className="px-6 py-4 text-xs text-[#64748B]">{new Date(b.booking_date).toLocaleDateString('en-US',{day:'2-digit',month:'short'})} · {b.booking_time||'TBD'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1E293B]">₱{(b.total_amount||0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${
                        b.status==='finished'?'bg-[#F1F5F9] text-[#64748B]':b.status==='confirmed'?'bg-[#ECFDF5] text-[#10B981]':b.status==='pending'?'bg-[#FFFBEB] text-[#F59E0B]':'bg-[#FEF2F2] text-[#EF4444]'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                )) : (<tr><td colSpan="5" className="py-12 text-center text-sm text-[#94A3B8]">No active sessions found</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {label:'Studio Yield', val:`₱${stats?.total_bookings>0?Math.round((stats?.total_revenue||0)/stats.total_bookings).toLocaleString():0}`, sub:'/ avg'},
            {label:'Fulfilment', val:`${stats?.total_bookings>0?Math.round((stats.confirmed_bookings/stats.total_bookings)*100):0}%`, sub:'rate'},
            {label:'Pending Value', val:`₱${((stats?.total_bookings-stats?.confirmed_bookings)*250||0).toLocaleString()}`, sub:'projected'},
          ].map((m,i)=>(
            <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-[#F1F5F9]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mb-2">{m.label}</p>
              <p className="text-2xl font-bold text-[#1E293B]">{m.val} <span className="text-xs text-[#94A3B8] font-normal">{m.sub}</span></p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
