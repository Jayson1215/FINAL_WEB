import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { paymentService } from '../../services/paymentService';

export default function RevenueReports() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { 
    try { 
      setLoading(true); setError(''); 
      const [r,p] = await Promise.all([paymentService.getReports(), paymentService.getAllPayments()]); 
      setStats(r.data); 
      setPayments(p.data||[]); 
    } catch(e){ setError('Failed to load financial data'); } 
    finally { setLoading(false); } 
  };

  const handleConfirmPayment = async (id) => { try { await paymentService.confirmPayment(id); fetchData(); } catch(e){ setError('Failed to confirm payment'); } };

  if(loading&&!stats) return (
    <AdminLayout title="Financial Analytics">
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto"></div>
        <p className="text-[10px] font-bold text-black uppercase tracking-widest">Aggregating Financials...</p>
      </div>
    </AdminLayout>
  );

  const statCards = [
    { label:'Collected Revenue', value:`₱${(stats?.total_revenue||0).toLocaleString()}`, color:'bg-green-500', icon: '💰' },
    { label:'Pending Revenue', value:`₱${(stats?.pending_revenue||0).toLocaleString()}`, color:'bg-amber-500', icon: '⏳' },
    { label:'Refunds Given', value:`₱${(stats?.refunded_amount||0).toLocaleString()}`, color:'bg-red-500', icon: '🔄' },
    { label:'Avg per Session', value:`₱${stats?.total_bookings>0?((stats.total_revenue+stats.pending_revenue)/stats.total_bookings).toLocaleString(undefined,{maximumFractionDigits:0}):0}`, color:'bg-indigo-500', icon: '📊' },
  ];

  return (
    <AdminLayout title="Financial Analytics">
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 uppercase tracking-widest">{error}</div>}
      
      <div className="space-y-12 animate-fadeIn">
        {/* Metric Grid - High Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((s,i) => (
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

        {/* Transactions Table - Audit Style */}
        <div className="bg-white rounded-[2rem] border border-black/20 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-black/10 flex justify-between items-center bg-slate-50/30">
            <div>
              <h3 className="text-lg font-bold text-black uppercase tracking-widest">Transaction Audit</h3>
              <p className="text-[10px] font-bold text-black opacity-40 uppercase tracking-[0.2em] mt-1">Full Ledger Record</p>
            </div>
            <div className="px-4 py-2 bg-white border border-black/10 rounded-xl text-[10px] font-bold text-black uppercase tracking-widest">
              Verified Entries
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-black/20">
                  {['Reference', 'Lead Client', 'Channel', 'Amount', 'Verification'].map((h, i)=>(
                    <th key={h} className={`px-8 py-5 text-[9px] font-bold text-black uppercase tracking-[0.25em] ${i < 4 ? 'border-r border-black/10' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 bg-white">
                {payments.length>0 ? payments.map(p=>(
                  <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 border-r border-black/5 text-[10px] font-bold tracking-widest text-black uppercase">{p.transaction_reference}</td>
                    <td className="px-8 py-6 border-r border-black/5">
                      <p className="text-sm font-bold text-black">{p.booking?.user?.name||'Guest'}</p>
                    </td>
                    <td className="px-8 py-6 border-r border-black/5">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black bg-slate-100 border border-black/5 px-3 py-1 rounded-md">{p.payment_method}</span>
                    </td>
                    <td className="px-8 py-6 border-r border-black/5 text-sm font-bold text-black">
                      ₱{parseFloat(p.amount).toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {p.payment_status==='pending' ? (
                        <button onClick={()=>handleConfirmPayment(p.id)} className="text-[9px] font-bold text-white bg-black px-5 py-2.5 rounded-lg hover:bg-[#E8734A] transition-all uppercase tracking-widest shadow-lg">Confirm Entry</button>
                      ) : (
                        <div className="flex justify-end">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-green-600 bg-green-50 border border-green-100 px-4 py-2 rounded-lg">Verified Session</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (<tr><td colSpan="5" className="py-20 text-center text-[10px] font-bold text-black uppercase tracking-widest italic opacity-40">No transactional records detected.</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Section - SaaS Professional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2rem] p-10 border border-black/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h3 className="text-lg font-bold text-black uppercase tracking-widest mb-8">Studio Fulfillment</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-black uppercase tracking-widest opacity-60">Success Rate</span>
              <span className="text-3xl font-bold text-black">{stats?.total_bookings>0?((stats.confirmed_bookings/stats.total_bookings)*100).toFixed(1):0}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-black/5">
              <div className="h-full bg-black transition-all duration-1000" style={{width:`${stats?.total_bookings>0?((stats.confirmed_bookings/stats.total_bookings)*100):0}%`}}></div>
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] p-10 border border-black/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#E8734A]"></div>
            <h3 className="text-lg font-bold text-black uppercase tracking-widest mb-8">Performance Indices</h3>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black opacity-40">Average Revenue Per Lifecycle</p>
              <p className="text-4xl font-bold text-black tracking-tighter">₱{stats?.total_bookings>0?(stats.total_revenue/stats.total_bookings).toLocaleString():0}</p>
            </div>
            <div className="mt-6 flex items-center gap-2">
               <span className="w-2 h-2 bg-[#E8734A] rounded-full animate-pulse"></span>
               <p className="text-[9px] font-bold text-black uppercase tracking-widest opacity-40">Dynamic Calculation Active</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
