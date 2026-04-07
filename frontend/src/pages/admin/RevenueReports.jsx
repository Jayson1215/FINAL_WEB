import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { paymentService } from '../../services/paymentService';

export default function RevenueReports() {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [reportsResp, paymentsResp] = await Promise.all([
        paymentService.getReports(),
        paymentService.getAllPayments()
      ]);
      setStats(reportsResp.data);
      setPayments(paymentsResp.data || []);
    } catch (err) {
      setError('Failed to load financial data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await paymentService.confirmPayment(paymentId);
      // Refresh both reports and payments
      fetchData();
    } catch (err) {
      setError('Failed to confirm payment');
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
    <AdminLayout title="Financial Audit">
      {error && (
        <div className="mb-10 p-6 bg-red-50 border-l-2 border-red-200">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">Audit Notice</p>
          <p className="text-sm text-red-800 font-serif italic">{error}</p>
        </div>
      )}

      <div className="space-y-16 animate-fadeIn pb-32">
        {/* Editorial Header */}
        <div className="border-b border-[#EEEEEE] pb-10">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-tight mb-4">Revenue Reports</h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C79F68]">A comprehensive audit of your studio's fiscal performance and yield.</p>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#EEEEEE] divide-y md:divide-y-0 md:divide-x divide-[#EEEEEE]">
          <div className="bg-white p-10 group hover:bg-[#F9F9F9] transition-all duration-700">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8">Collected Yield</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] text-[#C79F68] font-serif">₱</span>
              <span className="text-4xl font-serif text-[#1A1A1A]">{(stats?.total_revenue || 0).toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-white p-10 group hover:bg-[#F9F9F9] transition-all duration-700">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8">Pending Yield</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] text-[#BBB] font-serif">₱</span>
              <span className="text-4xl font-serif text-[#777]">{(stats?.pending_revenue || 0).toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-white p-10 group hover:bg-[#F9F9F9] transition-all duration-700">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8">Refunds Given</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[15px] text-red-300 font-serif">₱</span>
              <span className="text-4xl font-serif text-red-500">{(stats?.refunded_amount || 0).toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-white p-10 group hover:bg-[#F9F9F9] transition-all duration-700">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-8">Engagement Value</p>
            <span className="text-4xl font-serif text-[#1A1A1A]">
              ₱{stats?.total_bookings > 0 ? ((stats.total_revenue + stats.pending_revenue) / stats.total_bookings).toLocaleString(undefined, {maximumFractionDigits: 0}) : 0}
            </span>
          </div>
        </div>

        {/* Payment Audit - New Table */}
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-6">
                <h3 className="text-2xl font-serif text-[#1A1A1A]">Recent Transactions</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Audit Ledger</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Reference</th>
                            <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Client</th>
                            <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Method</th>
                            <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Amount</th>
                            <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F5]">
                        {payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment.id} className="group hover:bg-[#FAFAFA] transition-all duration-500">
                                    <td className="py-6 text-[10px] font-bold tracking-widest text-[#777] uppercase">{payment.transaction_reference}</td>
                                    <td className="py-6 font-serif text-sm text-[#1A1A1A]">{payment.booking?.user?.name || 'Guest'}</td>
                                    <td className="py-6 text-[9px] font-bold uppercase tracking-[0.2em] text-[#AAA]">{payment.payment_method}</td>
                                    <td className="py-6 font-serif text-sm text-[#1A1A1A]">₱{(parseFloat(payment.amount)).toLocaleString()}</td>
                                    <td className="py-6 text-right">
                                        {payment.payment_status === 'pending' ? (
                                            <button 
                                                onClick={() => handleConfirmPayment(payment.id)}
                                                className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C79F68] border border-[#C79F68]/30 px-5 py-2 hover:bg-[#C79F68] hover:text-white transition duration-500"
                                            >
                                                Confirm Receipt
                                            </button>
                                        ) : (
                                            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-emerald-600 border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                                                Verified
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-20 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-[#BBB]">No transactions logged</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#EEEEEE] divide-y lg:divide-y-0 lg:divide-x divide-[#EEEEEE]">
          <div className="p-12 space-y-10">
            <h3 className="text-xl font-serif text-[#1A1A1A]">Studio Fulfilment</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#777]">Completion Rate</span>
                <span className="text-2xl font-serif text-[#1A1A1A]">
                  {stats?.total_bookings > 0 
                    ? ((stats.confirmed_bookings / stats.total_bookings) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-[#F5F5F5] h-px relative">
                <div 
                  className="absolute top-0 left-0 h-px bg-[#1A1A1A] transition-all duration-1000"
                  style={{width: `${stats?.total_bookings > 0 ? ((stats.confirmed_bookings / stats.total_bookings) * 100) : 0}%`}}
                ></div>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-10">
            <h3 className="text-xl font-serif text-[#1A1A1A]">Performance Metrics</h3>
            <div className="space-y-12">
              <div className="border-l border-[#C79F68] pl-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA] mb-3">Avg Revenue per Session</p>
                <p className="text-3xl font-serif text-[#1A1A1A]">
                  ₱{stats?.total_bookings > 0 ? (stats.total_revenue / stats.total_bookings).toLocaleString() : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
