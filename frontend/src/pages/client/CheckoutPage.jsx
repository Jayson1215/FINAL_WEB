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
    if (bookingData) {
      setBooking(JSON.parse(bookingData));
    } else {
      setTimeout(() => {
        navigate('/client/services');
      }, 1000);
    }
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!booking || !booking.id) {
      setError('Reservation details are incomplete. Please start over.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // By default, we pay the downpayment during checkout to confirm reservation
      const response = await paymentService.createPayment(booking.id, paymentMethod, 'downpayment');
      setSuccess(true);
      
      // Clear persistence after successful intent
      sessionStorage.removeItem('bookingData');
      
      setTimeout(() => {
        navigate('/client/bookings');
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Payment processing encountered an issue';
      setError(errorMsg);
      console.error('Checkout Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <ClientLayout title="Authorization">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#C79F68] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ClientLayout>
    );
  }

  if (success) {
    return (
      <ClientLayout title="Confirmed">
        <div className="max-w-md mx-auto text-center py-20 bg-white border border-[#EEEEEE] shadow-premium">
          <div className="w-20 h-20 rounded-full bg-[#F9F9F9] flex items-center justify-center mx-auto mb-8 border border-[#EEEEEE]">
            <span className="text-[#C79F68] text-3xl font-serif">✓</span>
          </div>
          <h2 className="text-3xl font-serif text-[#333] mb-4">Reservation Confirmed</h2>
          <p className="text-sm text-[#777] mb-10 leading-relaxed px-12">
            Your session is now officially reserved. We've received your downpayment and sent the receipt to your email.
          </p>
          <div className="w-12 h-px bg-[#C79F68] mx-auto opacity-40"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Secure Checkout">
      <div className="max-w-4xl mx-auto">
        {error && (
            <div className="mb-12 p-6 bg-red-50 border border-red-100 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-red-800 mb-2">Notice</p>
                <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
        )}

        {/* Multi-step flow indicator */}
        <div className="flex justify-center items-center space-x-4 mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C79F68]">1. Package</span>
            <span className="w-8 h-px bg-[#EEEEEE]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C79F68]">2. Details</span>
            <span className="w-8 h-px bg-[#EEEEEE]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#333]">3. Confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8">
            <form onSubmit={handlePayment} className="space-y-16">
              {/* Payment Methods Section */}
              <div className="space-y-8">
                <div className="flex items-center space-x-6 mb-10">
                    <span className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-[10px] font-bold mt-1">✓</span>
                    <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#333]">
                        Finalize Payment
                    </label>
                </div>

                <div className="space-y-4">
                  {/* Credit Card */}
                  <label className={`flex items-center px-10 py-8 border transition-all duration-500 cursor-pointer ${
                    paymentMethod === 'card' 
                      ? 'border-[#333] bg-[#F9F9F9]' 
                      : 'border-[#EEEEEE] hover:border-[#333]'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-[#333]"
                    />
                    <div className="ml-8 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333] block mb-1">Credit or Debit Card</span>
                      <span className="text-[10px] text-[#AAA] font-medium uppercase tracking-widest">Visa, Mastercard, AMEX</span>
                    </div>
                  </label>

                  {/* GCash Payment */}
                  <label className={`flex items-center px-10 py-8 border transition-all duration-500 cursor-pointer ${
                    paymentMethod === 'gcash' 
                      ? 'border-[#333] bg-[#F9F9F9]' 
                      : 'border-[#EEEEEE] hover:border-[#333]'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gcash"
                      checked={paymentMethod === 'gcash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-[#333]"
                    />
                    <div className="ml-8 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333] block mb-1">GCash Mobile Wallet</span>
                      <span className="text-[10px] text-[#AAA] font-medium uppercase tracking-widest">Direct digital transfer</span>
                    </div>
                  </label>

                  {/* Cash on Hand */}
                  <label className={`flex items-center px-10 py-8 border transition-all duration-500 cursor-pointer ${
                    paymentMethod === 'cash' 
                      ? 'border-[#333] bg-[#F9F9F9]' 
                      : 'border-[#EEEEEE] hover:border-[#333]'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 accent-[#333]"
                    />
                    <div className="ml-8 flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333] block mb-1">Pay at Studio</span>
                      <span className="text-[10px] text-[#AAA] font-medium uppercase tracking-widest">Cash or check on the day</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A1A] text-white py-6 text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C79F68] transition-all duration-700 shadow-premium"
              >
                {loading ? 'Processing Transaction...' : `Confirm Reservation – ₱${parseFloat(booking.downpayment_amount || (booking.total_amount * 0.2)).toLocaleString()}`}
              </button>

              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[#AAA] font-bold">
                 SSL SECURED • ENCRYPTED TRANSACTION
              </p>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#EEEEEE] p-12 sticky top-32">
                <h3 className="text-xl font-serif text-[#333] mb-8 pb-6 border-b border-[#EEEEEE]">
                    Your Session
                </h3>
                
                <div className="space-y-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-2">Financial Breakdown</p>
                        <div className="space-y-6 bg-[#F9F9F9] p-8 border border-[#EEEEEE]">
                            <div className="flex flex-col space-y-2">
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#AAA]">Total Investment</span>
                                <span className="text-sm font-serif text-[#777]">₱{parseFloat(booking.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-[#EEEEEE] w-full"></div>
                            <div className="flex flex-col space-y-2">
                                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#333]">Due Now (Downpayment)</span>
                                <span className="text-2xl font-serif text-[#C79F68]">₱{parseFloat(booking.downpayment_amount || (booking.total_amount * 0.2)).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-2">Photography Package</p>
                        <p className="text-sm text-[#333] font-medium">{booking.service?.name}</p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-2">Schedule</p>
                        <p className="text-sm text-[#333] font-medium">
                            {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                        </p>
                        <p className="text-[11px] text-[#C79F68] mt-1 font-bold">{booking.booking_time}</p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#EEEEEE] text-center">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#AAA] leading-relaxed">
                        By confirming, you agree to our terms of service regarding photography and digital rights.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
