import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { paymentService } from '../../services/paymentService';
import { bookingService } from '../../services/bookingService';

export default function AdminDashboard() {
  const [d, setD] = useState({ stats: {}, bookings: [], loading: true, error: '' });
  
  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, b] = await Promise.allSettled([paymentService.getReports(), bookingService.getAllBookings()]);
        setD({ stats: s.status === 'fulfilled' ? s.value.data : {}, bookings: (b.status === 'fulfilled' ? b.value.data : []).slice(0, 10), loading: false, error: '' });
      } catch (e) { setD(p => ({ ...p, loading: false, error: 'Failed' })); }
    };
    fetch();
  }, []);

  if (d.loading) return (
    <AdminLayout title="Dashboard">
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#E8734A] rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Loading metrics...</p>
      </div>
    </AdminLayout>
  );

  const stats = [
    { label: 'Total Revenue', value: `₱${(d.stats?.total_revenue || 0).toLocaleString()}`, color: 'bg-slate-900', icon: '₱' },
    { label: 'Total Sessions', value: d.stats?.total_bookings || 0, color: 'bg-[#E8734A]', icon: '📸' },
    { label: 'Confirmed', value: d.stats?.confirmed_bookings || 0, color: 'bg-indigo-500', icon: '✨' },
    { label: 'Pending', value: d.stats?.pending_payments || 0, color: 'bg-emerald-500', icon: '💳' }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-12 animate-fadeIn">
        
        {/* Metric Grid - Professional Clean Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-black/20 shadow-sm hover:shadow-md transition-all flex flex-col relative group">
              <div className={`absolute top-0 left-0 right-0 h-1 ${s.color}`}></div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black">{s.label}</p>
                  <span className="text-sm opacity-20 group-hover:opacity-100 transition-opacity">{s.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-black tracking-tight">{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings - SaaS Data Style */}
        <div className="bg-white rounded-[2rem] border border-black/20 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-black/10 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-black uppercase tracking-widest">Recent Bookings</h3>
              <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mt-1">Live Reservation Stream</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[9px] font-bold text-black uppercase tracking-widest">Real-time</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-black/20">
                  {['Lead Client', 'Package Selection', 'Revenue', 'Status', 'Timeline'].map((h, i) => (
                    <th key={h} className={`px-10 py-5 text-[9px] font-bold text-black uppercase tracking-[0.25em] ${i < 4 ? 'border-r border-black/10' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 bg-white">
                {d.bookings.map((b, i) => (
                  <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6 border-r border-black/5">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-black text-[10px] border border-black/10">
                          {b.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black">{b.user?.name}</p>
                          <p className="text-[10px] text-black font-medium">{b.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-medium text-black italic border-r border-black/5">"{b.service?.name}"</td>
                    <td className="px-10 py-6 border-r border-black/5">
                      <p className="text-xs font-bold text-black">₱{parseFloat(b.total_amount).toLocaleString()}</p>
                    </td>
                    <td className="px-10 py-6 border-r border-black/5">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest ${
                        b.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-black/10' : 
                        b.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-black/10' : 'bg-slate-50 text-black border border-black/10'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-[10px] font-bold text-black uppercase tracking-widest">
                      {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {d.bookings.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-black text-[10px] font-bold uppercase tracking-widest italic">No active records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
