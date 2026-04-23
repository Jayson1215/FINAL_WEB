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
        setD({ stats: s.status === 'fulfilled' ? s.value.data : {}, bookings: (b.status === 'fulfilled' ? b.value.data : []).slice(0, 8), loading: false, error: '' });
      } catch (e) { setD(p => ({ ...p, loading: false, error: 'Failed' })); }
    };
    fetch();
  }, []);

  if (d.loading) return <AdminLayout title="..."><div className="h-96 flex items-center justify-center animate-pulse text-[#64748B]">Loading Studio Data...</div></AdminLayout>;

  const cards = [
    { l: 'Revenue', v: `₱${(d.stats?.total_revenue || 0).toLocaleString()}`, c: 'text-[#E8734A]' },
    { l: 'Sessions', v: d.stats?.total_bookings || 0, c: 'text-[#6366F1]' },
    { l: 'Confirmed', v: d.stats?.confirmed_bookings || 0, c: 'text-[#10B981]' },
    { l: 'Pending', v: d.stats?.pending_payments || 0, c: 'text-[#F59E0B]' }
  ];

  return (
    <AdminLayout title="Overview">
      <div className="space-y-6">
        <div className="bg-[#1E293B] rounded-2xl p-8 text-white"><h2 className="text-2xl font-serif">Studio Manager.</h2><p className="text-white/60 text-xs mt-1">Real-time session and revenue metrics.</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => <div key={i} className="bg-white rounded-2xl p-5 border shadow-sm"><p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest">{c.l}</p><p className={`text-2xl font-bold mt-2 ${c.c}`}>{c.v}</p></div>)}
        </div>
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <div className="p-5 border-b font-bold text-[#1E293B]">Recent Activity</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FB]"><tr>{['Client','Service','Amount','Status'].map(h => <th key={h} className="px-6 py-3 text-[#94A3B8] uppercase tracking-widest">{h}</th>)}</tr></thead>
              <tbody>
                {d.bookings.map(b => (
                  <tr key={b.id} className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-bold">{b.user?.name}</td><td className="px-6 py-4">{b.service?.name}</td><td className="px-6 py-4 font-bold">₱{parseFloat(b.total_amount).toLocaleString()}</td><td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded-md font-bold uppercase text-[9px]">{b.status}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
