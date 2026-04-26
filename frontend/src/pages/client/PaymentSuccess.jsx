import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const [status, setStatus] = useState('verifying');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verify = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'https://final-web-ls8m.onrender.com/api';
        await axios.post(`${apiBase}/payments/verify`, { session_id: sessionId });
        setStatus('success');
        // Redirect to My Bookings after 3 seconds
        setTimeout(() => nav('/client/MyBookings'), 3000);
      } catch (err) {
        console.error('Verification failed', err);
        setStatus('error');
      }
    };

    if (sessionId) verify();
  }, [sessionId, nav]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center space-y-8 animate-fadeIn">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-slate-100 border-t-[#E8734A] rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-serif text-black">Verifying Payment...</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Please do not close this window</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <span className="text-4xl text-emerald-500">✓</span>
            </div>
            <h2 className="text-3xl font-serif text-black">Payment Received!</h2>
            <p className="text-xs text-gray-500 leading-relaxed italic">
              Your luxury session is now secured. We are redirecting you back to your bookings...
            </p>
            <div className="pt-6">
               <button onClick={() => nav('/client/MyBookings')} className="bg-black text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all">Go to My Bookings</button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-4xl text-red-500">!</span>
            </div>
            <h2 className="text-2xl font-serif text-black">Verification Failed</h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              We couldn't verify the payment status automatically. Please contact our studio support.
            </p>
            <button onClick={() => nav('/client/MyBookings')} className="bg-black text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase">Back to Bookings</button>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
