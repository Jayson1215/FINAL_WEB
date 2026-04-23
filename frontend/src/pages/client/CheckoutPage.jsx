import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { paymentService } from '../../services/paymentService';

export default function CheckoutPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [d, setD] = useState({ b: state?.booking || null, m: 'gcash', loading: false, done: false, err: '' });

  useEffect(() => { if (!d.b) nav('/client/Packages'); }, [d.b]);

  const pay = async (e) => {
    e.preventDefault();
    setD(p => ({ ...p, loading: true, err: '' }));
    try {
      await paymentService.createPayment(d.b.id, d.m, 'full');
      setD(p => ({ ...p, done: true, loading: false }));
      setTimeout(() => nav('/client/MyBookings'), 3000);
    } catch (err) { setD(p => ({ ...p, loading: false, err: 'Payment Failed' })); }
  };

  if (!d.b) return null;
  if (d.done) return <ClientLayout title="Success"><div className="text-center py-24 bg-white rounded-[3rem] shadow-sm animate-fadeIn"><div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">✓</div><h2 className="text-4xl font-serif">Confirmed!</h2><p className="mt-4 text-gray-500 italic">Redirecting to registry...</p></div></ClientLayout>;

  return (
    <ClientLayout title="Secure Checkout">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 animate-fadeIn">
        <form onSubmit={pay} className="bg-white p-10 rounded-[3rem] border shadow-sm space-y-8">
          <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-widest">Select Method</p>
          {['gcash', 'card', 'bank'].map(m => (
            <label key={m} className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${d.m === m ? 'border-[#E8734A] bg-orange-50' : 'border-gray-50 bg-gray-50'}`}>
              <input type="radio" className="hidden" checked={d.m === m} onChange={() => setD({...d, m})} />
              <span className="text-2xl mr-4">{m === 'gcash' ? '📱' : m === 'card' ? '💳' : '🏦'}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{m}</span>
            </label>
          ))}
          <button type="submit" disabled={d.loading} className="w-full bg-[#1E293B] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest">{d.loading ? 'Processing...' : `Pay ₱${parseFloat(d.b.total_amount).toLocaleString()}`}</button>
        </form>
        <div className="bg-white p-10 rounded-[3rem] border shadow-sm space-y-6">
          <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-widest">Investment</p>
          <h3 className="text-2xl font-serif">{d.b.service?.name}</h3>
          <div className="pt-6 border-t space-y-4 text-[10px] font-bold uppercase text-gray-400">
            <div className="flex justify-between"><span>Date</span><span className="text-black">{new Date(d.b.booking_date).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span>Time</span><span className="text-black">{d.b.booking_time}</span></div>
            <div className="flex justify-between pt-4 border-t text-sm"><span className="text-[#1E293B]">Total</span><span className="text-[#E8734A]">₱{parseFloat(d.b.total_amount).toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
