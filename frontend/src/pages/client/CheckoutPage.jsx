import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { paymentService } from '../../services/paymentService';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Priority 1: State from navigation (Direct from My Bookings)
    if (location.state && location.state.booking) {
      setBooking(location.state.booking);
    } 
    // Priority 2: Session storage (New Booking flow)
    else {
      const bookingData = sessionStorage.getItem('bookingData');
      if (bookingData) {
        setBooking(JSON.parse(bookingData));
      } else {
        setTimeout(() => {
          navigate('/client/services');
        }, 1000);
      }
    }
  }, [navigate, location]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!booking || !booking.id) {
      setError('Session details are incomplete. Please contact support.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Simulate a small delay for security check
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // We use 'full' to trigger the final payment status
      await paymentService.createPayment(booking.id, paymentMethod, 'full');
      
      setSuccess(true);
      sessionStorage.removeItem('bookingData');
      
      setTimeout(() => {
        navigate('/client/bookings');
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <ClientLayout title="Secure Channel">
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin"></div>
        </div>
      </ClientLayout>
    );
  }

  if (success) {
    return (
      <ClientLayout title="Transaction Success">
        <div className="max-w-xl mx-auto text-center py-24 bg-white rounded-[4rem] shadow-premium border border-[#F1F5F9] animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#E8734A]"></div>
          <div className="w-32 h-32 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-xl">
             <span className="text-emerald-500 text-5xl">✦</span>
          </div>
          <h2 className="text-4xl font-serif text-[#1E293B] mb-4 tracking-tight">Payment Received</h2>
          <p className="text-base font-serif text-[#1E293B] mb-8">Transaction ID: {booking.id.split('-')[0].toUpperCase()}</p>
          <p className="text-sm text-[#64748B] mb-12 leading-relaxed px-16 font-medium italic">
            "Your session is now fully confirmed in our registry. Our team will arrive at your location on the scheduled date."
          </p>
          <div className="flex justify-center gap-3">
             {[0, 75, 150].map(d => <div key={d} className={`w-2 h-2 rounded-full bg-[#E8734A] animate-bounce`} style={{ animationDelay: `${d}ms` }}></div>)}
          </div>
        </div>
      </ClientLayout>
    );
  }

  const totalAmount = parseFloat(booking.total_amount || 0);

  return (
    <ClientLayout title="Concierge Payment">
      <div className="max-w-6xl mx-auto pb-20">
        {error && (
            <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-[2rem] text-center shadow-sm">
                <p className="text-sm text-red-600 font-bold tracking-widest uppercase mb-1">Security Alert</p>
                <p className="text-xs text-red-500 font-medium italic">"{error}"</p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <form onSubmit={handlePayment} className="space-y-12">
              <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-premium border border-[#F1F5F9] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8734A]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                
                <div className="flex flex-col gap-2 mb-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E8734A]">Secure Transaction</p>
                    <h3 className="text-3xl font-serif text-[#1E293B]">Select Method</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { id: 'gcash', label: 'GCash Wallet', sub: 'Standard mobile payment in the Philippines', icon: '📱' },
                    { id: 'card', label: 'Credit / Debit', sub: 'Visa, Mastercard & American Express', icon: '💳' },
                    { id: 'bank', label: 'Direct Transfer', sub: 'BDO, BPI & UnionBank options', icon: '🏦' },
                  ].map((method) => (
                    <label key={method.id} className={`group relative flex items-center p-8 rounded-3xl border-2 transition-all duration-700 cursor-pointer ${
                      paymentMethod === method.id 
                        ? 'border-[#E8734A] bg-[#FFF7ED] shadow-xl translate-x-2' 
                        : 'border-[#F1F5F9] hover:border-[#E2E8F0] bg-[#F8F9FB] hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-all duration-700 ${paymentMethod === method.id ? 'bg-white scale-110' : 'bg-[#EEF2FF] grayscale opacity-40'}`}>
                        {method.icon}
                      </div>
                      <div className="ml-8 flex-1">
                        <span className={`text-[12px] font-bold uppercase tracking-[0.2em] block mb-2 transition-colors ${paymentMethod === method.id ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>
                          {method.label}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] font-bold tracking-widest uppercase">{method.sub}</span>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="w-6 h-6 rounded-full bg-[#E8734A] flex items-center justify-center text-white text-[10px] shadow-lg animate-fadeIn">✓</div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E293B] text-white py-8 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.5em] disabled:opacity-30 hover:bg-[#E8734A] hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-700 shadow-xl flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Execute Transaction</span>
                    <span className="w-1.5 h-1.5 bg-[#E8734A] rounded-full group-hover:bg-white"></span>
                    <span className="text-white/60 group-hover:text-white">₱{totalAmount.toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-[3rem] shadow-premium border border-[#F1F5F9] p-12 sticky top-32">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E8734A]">Investment Summary</p>
                        <h4 className="text-2xl font-serif text-[#1E293B] border-b border-[#F1F5F9] pb-6">{booking.service?.name}</h4>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.1em]">
                            <span className="text-[#94A3B8]">Session Date</span>
                            <span className="text-[#1E293B]">{new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.1em]">
                            <span className="text-[#94A3B8]">Start Time</span>
                            <span className="text-[#1E293B]">{booking.booking_time}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-[0.1em]">
                            <span className="text-[#94A3B8]">Location</span>
                            <span className="text-[#1E293B]">{booking.location ? 'Concierge On-Call' : 'To Be Discussed'}</span>
                        </div>
                        <div className="pt-6 border-t border-[#F1F5F9] flex justify-between items-end">
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#1E293B]">Total Due</span>
                            <span className="text-4xl font-serif font-bold text-[#E8734A]">₱{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-[#F8F9FB] p-8 rounded-[2rem] space-y-4 border border-[#F1F5F9]">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#94A3B8] leading-relaxed">
                            A PREMIUM SERVICE FEE IS INCLUDED. CANCELLATIONS MADE WITHIN 24 HOURS ARE SUBJECT TO TERMS.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
