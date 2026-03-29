import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { paymentService } from '../../services/paymentService';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const bookingData = sessionStorage.getItem('bookingData');
    console.log('Checkout Page - Booking Data from Session:', bookingData ? JSON.parse(bookingData) : null);
    
    if (bookingData) {
      setBooking(JSON.parse(bookingData));
    } else {
      console.warn('No booking data found in session, redirecting to services');
      setTimeout(() => {
        navigate('/client/services');
      }, 1000);
    }
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('=== PAYMENT PROCESSING ===');
      console.log('Booking ID:', booking.id);
      console.log('Payment Method:', paymentMethod);
      console.log('Amount:', booking.total_amount);
      
      const response = await paymentService.createPayment(booking.id, paymentMethod);
      console.log('✅ Payment created:', response.data);
      
      setSuccess(true);

      setTimeout(() => {
        sessionStorage.removeItem('bookingData');
        navigate('/client/bookings');
      }, 2000);
    } catch (err) {
      console.error('❌ Payment Error:', err);
      console.error('Error Response:', err.response?.data);
      console.error('Error Status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Payment processing failed';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <ClientLayout title="Checkout">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading checkout...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (success) {
    return (
      <ClientLayout title="Checkout">
        <div className="flex items-center justify-center min-h-96">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-6 animate-bounce">✓</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Payment Successful!</h2>
            <p className="text-slate-700 mb-2">Your booking has been confirmed.</p>
            <p className="text-sm text-slate-600">Redirecting to your bookings...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Checkout">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Payment Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {/* Luxury Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-900 to-slate-800 p-16 shadow-2xl border border-amber-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-400 to-transparent opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-300 to-transparent opacity-10 rounded-full blur-3xl -ml-40 -mb-40"></div>
          
          <div className="relative z-10">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
              <p className="text-amber-950 text-xs font-bold uppercase tracking-widest">💳 Final Step</p>
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 mb-6 leading-tight">Secure Payment Details</h1>
            <p className="text-amber-100 text-lg font-light max-w-3xl leading-relaxed">Choose your preferred payment method and complete your booking with confidence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200/50 p-10 shadow-xl hover:shadow-2xl transition-shadow">
              <h2 className="text-3xl font-black text-slate-900 mb-10">💰 Choose Payment Method</h2>

              <form onSubmit={handlePayment} className="space-y-4">
                {/* Payment Options */}
                <div className="space-y-4">
                  {/* Credit Card */}
                  <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    paymentMethod === 'card' 
                      ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg shadow-amber-500/20' 
                      : 'border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/30'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-6 h-6 accent-amber-600"
                    />
                    <div className="ml-5 flex-1">
                      <span className="font-black text-slate-900 block text-lg">Credit or Debit Card</span>
                      <span className="text-sm text-slate-600 font-medium">Visa, Mastercard, or other major card providers</span>
                    </div>
                    <span className="text-4xl group-hover:scale-110 transition-transform">💳</span>
                  </label>

                  {/* GCash Payment */}
                  <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    paymentMethod === 'gcash' 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-500/20' 
                      : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-blue-50/30'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gcash"
                      checked={paymentMethod === 'gcash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-6 h-6 accent-blue-600"
                    />
                    <div className="ml-5 flex-1">
                      <span className="font-black text-slate-900 block text-lg">GCash Mobile Wallet</span>
                      <span className="text-sm text-slate-600 font-medium">Pay instantly using your GCash account</span>
                    </div>
                    <span className="text-4xl group-hover:scale-110 transition-transform">📱</span>
                  </label>

                  {/* Cash on Hand */}
                  <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    paymentMethod === 'cash' 
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg shadow-green-500/20' 
                      : 'border-slate-300 hover:border-green-400 bg-white hover:bg-green-50/30'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-6 h-6 accent-green-600"
                    />
                    <div className="ml-5 flex-1">
                      <span className="font-black text-slate-900 block text-lg">Pay on the Day</span>
                      <span className="text-sm text-slate-600 font-medium">Cash payment during your session</span>
                    </div>
                    <span className="text-4xl group-hover:scale-110 transition-transform">💵</span>
                  </label>
                </div>

                {/* Payment Info Box */}
                {(paymentMethod === 'card' || paymentMethod === 'gcash') && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300/50 p-6 rounded-2xl mt-8">
                    <p className="text-sm text-blue-900 font-medium flex items-start gap-3">
                      <span className="text-2xl mt-0">🔒</span>
                      <span>You will be securely redirected to our payment gateway to complete your transaction with 256-bit SSL encryption.</span>
                    </p>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300/50 p-6 rounded-2xl mt-8">
                    <p className="text-sm text-green-900 font-medium flex items-start gap-3">
                      <span className="text-2xl mt-0">✓</span>
                      <span>Your booking will be reserved. Please bring exact payment or card on the day of your session.</span>
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-10 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 hover:from-amber-700 hover:via-amber-800 hover:to-amber-950 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all duration-300 uppercase tracking-widest text-sm shadow-xl shadow-amber-600/40 hover:shadow-amber-700/50 border border-amber-500/30 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    {loading ? '⏳ Processing Payment...' : `✓ Complete Payment – ₱${parseFloat(booking.total_amount).toFixed(2)}`}
                  </span>
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="mt-10 pt-10 border-t-2 border-slate-300 flex gap-6 text-center">
                <div className="flex-1">
                  <p className="text-2xl mb-2">🏆</p>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Industry Leading</p>
                  <p className="text-xs text-slate-600 font-medium">Security</p>
                </div>
                <div className="flex-1">
                  <p className="text-2xl mb-2">📊</p>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">100K+</p>
                  <p className="text-xs text-slate-600 font-medium">Bookings</p>
                </div>
                <div className="flex-1">
                  <p className="text-2xl mb-2">⭐</p>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">4.9/5</p>
                  <p className="text-xs text-slate-600 font-medium">Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl border-2 border-slate-200/50 p-10 shadow-xl sticky top-6 h-fit">
              <h3 className="text-2xl font-black text-slate-900 mb-8 pb-6 border-b-2 border-slate-300">
                🎯 Your Booking
              </h3>

              <div className="space-y-8">
                {/* Service */}
                <div className="space-y-3">
                  <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Photography Service</p>
                  <p className="text-slate-900 font-black text-xl">{booking.service?.name}</p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                {/* Date & Time */}
                <div className="space-y-3">
                  <p className="text-slate-600 text-xs font-black uppercase tracking-widest">📅 Session Date & Time</p>
                  <div>
                    <p className="text-slate-900 font-black text-lg">
                      {new Date(booking.booking_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-amber-600 font-black text-2xl mt-2">{booking.booking_time}</p>
                  </div>
                </div>

                {booking.special_requests && (
                  <>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                    <div className="space-y-2">
                      <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Special Requests</p>
                      <p className="text-slate-800 text-sm font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-300/50">{booking.special_requests}</p>
                    </div>
                  </>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                {/* Total - Premium Styling */}
                <div className="bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border-2 border-amber-300/50 rounded-2xl p-8 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-black text-sm uppercase tracking-widest">Subtotal</span>
                    <span className="text-slate-900 font-black text-lg">₱{parseFloat(booking.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-amber-300/50"></div>
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-slate-700 font-black uppercase tracking-widest text-sm">TOTAL</p>
                    <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700">
                      ₱{parseFloat(booking.total_amount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Security Guarantee */}
                <div className="space-y-2 rounded-2xl bg-green-50/50 border-2 border-green-300/50 p-5">
                  <p className="text-xs font-black text-green-900 uppercase tracking-widest">✓ Safe & Secure</p>
                  <p className="text-xs text-green-800 font-medium">All payments processed with industry-standard encryption and fraud protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
