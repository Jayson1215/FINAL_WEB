import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { paymentService } from '../../services/paymentService';

export default function RevenueReports() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { try { setLoading(true); setError(''); const [r,p] = await Promise.all([paymentService.getReports(), paymentService.getAllPayments()]); setStats(r.data); setPayments(p.data||[]); } catch(e){ setError('Failed to load financial data'); } finally { setLoading(false); } };
  const handleConfirmPayment = async (id) => { try { await paymentService.confirmPayment(id); fetchData(); } catch(e){ setError('Failed to confirm payment'); } };

  if(loading&&!stats) return (<AdminLayout title="Revenue Reports"><div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto"></div></div></AdminLayout>);

  const statCards = [
    { label:'Collected Revenue', value:`₱${(stats?.total_revenue||0).toLocaleString()}`, color:'text-[#10B981]', bg:'bg-[#ECFDF5]' },
    { label:'Pending Revenue', value:`₱${(stats?.pending_revenue||0).toLocaleString()}`, color:'text-[#F59E0B]', bg:'bg-[#FFFBEB]' },
    { label:'Refunds Given', value:`₱${(stats?.refunded_amount||0).toLocaleString()}`, color:'text-[#EF4444]', bg:'bg-[#FEF2F2]' },
    { label:'Avg per Session', value:`₱${stats?.total_bookings>0?((stats.total_revenue+stats.pending_revenue)/stats.total_bookings).toLocaleString(undefined,{maximumFractionDigits:0}):0}`, color:'text-[#6366F1]', bg:'bg-[#EEF2FF]' },
  ];

  return (
    <AdminLayout title="Revenue Reports">
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      <div className="space-y-8 animate-fadeIn">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((s,i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-[#F1F5F9] hover:shadow-card-hover transition-all">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mb-4">{s.label}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}><span className={`text-lg font-bold ${s.color}`}>₱</span></div>
                <span className={`text-2xl font-bold ${s.color}`}>{s.value.replace('₱','')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-card border border-[#F1F5F9] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F1F5F9] flex justify-between items-center">
            <div><h3 className="text-lg font-bold text-[#1E293B]">Recent Transactions</h3><p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mt-0.5">Audit ledger</p></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8F9FB]"><tr>
                {['Reference','Client','Method','Amount','Action'].map(h=>(<th key={h} className={`px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] ${h==='Action'?'text-right':''}`}>{h}</th>))}
              </tr></thead>
              <tbody>
                {payments.length>0 ? payments.map(p=>(
                  <tr key={p.id} className="border-b border-[#F8F9FB] hover:bg-[#FAFBFC] transition-colors">
                    <td className="px-6 py-4 text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase">{p.transaction_reference}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1E293B]">{p.booking?.user?.name||'Guest'}</td>
                    <td className="px-6 py-4"><span className="text-[10px] font-semibold uppercase tracking-wider text-[#6366F1] bg-[#EEF2FF] px-2.5 py-1 rounded-md">{p.payment_method}</span></td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1E293B]">₱{parseFloat(p.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      {p.payment_status==='pending' ? (
                        <button onClick={()=>handleConfirmPayment(p.id)} className="text-xs font-semibold text-white bg-gradient-to-r from-[#E8734A] to-[#FB923C] px-4 py-2 rounded-lg hover:shadow-md transition">Confirm</button>
                      ) : (<span className="text-[9px] font-bold uppercase tracking-wider text-[#10B981] bg-[#ECFDF5] px-3 py-1.5 rounded-lg">Verified</span>)}
                    </td>
                  </tr>
                )) : (<tr><td colSpan="5" className="py-12 text-center text-sm text-[#94A3B8]">No transactions logged</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-8 shadow-card border border-[#F1F5F9]">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6">Studio Fulfilment</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#64748B]">Completion Rate</span>
              <span className="text-2xl font-bold text-[#1E293B]">{stats?.total_bookings>0?((stats.confirmed_bookings/stats.total_bookings)*100).toFixed(1):0}%</span>
            </div>
            <div className="w-full bg-[#F0F2F5] h-2 rounded-full"><div className="h-2 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-1000" style={{width:`${stats?.total_bookings>0?((stats.confirmed_bookings/stats.total_bookings)*100):0}%`}}></div></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-card border border-[#F1F5F9]">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6">Performance Metrics</h3>
            <div className="border-l-4 border-[#E8734A] pl-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">Avg Revenue per Session</p>
              <p className="text-3xl font-bold text-[#1E293B]">₱{stats?.total_bookings>0?(stats.total_revenue/stats.total_bookings).toLocaleString():0}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
