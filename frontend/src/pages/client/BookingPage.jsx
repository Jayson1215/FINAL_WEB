import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    bookingDate: '',
    bookingTime: '',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching service with ID:', serviceId);
      const response = await serviceService.getServiceDetail(serviceId);
      console.log('Service response:', response.data);
      
      if (!response.data) {
        throw new Error('Service data is empty');
      }
      
      setService(response.data);
    } catch (err) {
      console.error('Service fetch error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load service details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Generate available time slots (9 AM to 5 PM in 1-hour intervals)
  const getAvailableTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      const timeString = `${String(hour).padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.bookingDate || !formData.bookingTime) {
      setError('Please select both date and time');
      return;
    }

    setSubmitting(true);

    try {
      console.log('=== BOOKING SUBMISSION ===');
      console.log('Service ID:', serviceId);
      console.log('Booking Date:', formData.bookingDate);
      console.log('Booking Time:', formData.bookingTime);
      console.log('Total Amount:', service.price);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      console.log('Auth Token Present:', !!token);
      
      if (!token) {
        setError('You must be logged in to make a booking. Please log in first.');
        setSubmitting(false);
        return;
      }

      const bookingPayload = {
        service_id: serviceId,
        booking_date: formData.bookingDate,
        booking_time: formData.bookingTime,
        special_requests: formData.specialRequests,
        total_amount: service.price,
        add_on_ids: [],
      };
      
      console.log('Sending booking payload:', bookingPayload);
      
      const response = await bookingService.createBooking(bookingPayload);
      console.log('✅ Booking created successfully:', response.data);

      // Store booking in session and navigate to checkout
      sessionStorage.setItem('bookingData', JSON.stringify(response.data));
      console.log('Navigating to checkout...');
      navigate('/client/checkout');
    } catch (err) {
      console.error('❌ Booking Error:', err);
      console.error('Error Response:', err.response?.data);
      console.error('Error Status:', err.response?.status);
      console.error('Error Message:', err.message);
      
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Failed to create booking. Please try again.';
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout title="Book a Session">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading service details...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!service) {
    return (
      <ClientLayout title="Book a Session">
        <div className="text-center py-16">
          <div className="inline-block bg-red-50 border border-red-200 rounded-2xl p-8">
            <span className="text-5xl block mb-4">❌</span>
            <p className="text-red-700 text-xl font-bold mb-2">Service Not Found</p>
            <p className="text-red-600 mb-6">The service you're trying to book doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/client/services')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Browse Other Services
            </button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  // Get minimum date (today + 1 day)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <ClientLayout title="Book a Session">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Booking Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {/* Luxury Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-16 shadow-2xl border border-blue-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400 to-transparent opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300 to-transparent opacity-10 rounded-full blur-3xl -ml-40 -mb-40"></div>
          
          <div className="relative z-10">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full">
              <p className="text-blue-950 text-xs font-bold uppercase tracking-widest">✓ Secure Booking</p>
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-blue-50 to-blue-200 mb-6 leading-tight">Reserve Your Perfect Session</h1>
            <p className="text-blue-100 text-lg font-light max-w-3xl leading-relaxed">Choose your preferred date and time to capture your most precious moments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200/50 p-10 shadow-xl hover:shadow-2xl transition-shadow">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Service Display */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-800 to-slate-800 p-10 border border-blue-500/30">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <p className="text-blue-300 text-xs font-black uppercase tracking-widest mb-3">📸 Selected Service</p>
                    <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-200 mb-4">{service.name}</h3>
                    <p className="text-blue-100 text-sm font-light leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="space-y-8">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">
                      📅 Select Your Date
                    </label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      min={minDate}
                      required
                      className="w-full px-5 py-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 hover:border-blue-400 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">
                      ⏰ Choose Time Slot
                    </label>
                    {formData.bookingDate ? (
                      <select
                        name="bookingTime"
                        value={formData.bookingTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 hover:border-blue-400 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      >
                        <option value="">Choose a time slot</option>
                        {getAvailableTimeSlots().map((slot) => (
                          <option key={slot} value={slot} className="font-semibold">
                            {slot} - {slot === '16:00' ? '17:00' : `${String(parseInt(slot) + 1).padStart(2, '0')}:00`}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-5 py-4 bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300 rounded-2xl text-slate-600 italic font-semibold">
                        Select a date first
                      </div>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">
                      💬 Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Share any special themes, preferences, or detailed requirements for your session..."
                      className="w-full px-5 py-4 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 hover:border-blue-400 rounded-2xl text-slate-900 placeholder-slate-500 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 hover:from-blue-700 hover:via-blue-800 hover:to-blue-950 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all duration-300 uppercase tracking-widest text-sm shadow-xl shadow-blue-600/40 hover:shadow-blue-700/50 border border-blue-500/30 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    {submitting ? '⏳ Processing...' : '→ Continue to Checkout'}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Premium Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl border-2 border-slate-200/50 p-10 shadow-xl sticky top-6 h-fit">
              <h3 className="text-2xl font-black text-slate-900 mb-8 pb-6 border-b-2 border-slate-300">
                🎯 Order Summary
              </h3>

              <div className="space-y-8">
                {/* Service Details */}
                <div className="space-y-3">
                  <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Photography Service</p>
                  <p className="text-slate-900 font-black text-xl">{service.name}</p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                <div className="space-y-3">
                  <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Session Length</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-slate-900 text-3xl font-black">{service.duration}</p>
                    <p className="text-slate-600 font-bold">minutes</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                <div className="space-y-3">
                  <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Category</p>
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 text-xs font-black rounded-full border border-blue-300">
                    ✓ {service.category || 'Professional'}
                  </span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                {/* Total Amount - Premium Style */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-2 border-blue-300/50 rounded-2xl p-8 space-y-3">
                  <p className="text-blue-900 text-xs font-black uppercase tracking-widest">Total Investment</p>
                  <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                    ₱{parseFloat(service.price).toFixed(2)}
                  </p>
                  <p className="text-blue-800 text-xs font-semibold">All-inclusive, no hidden fees</p>
                </div>

                {/* Trust Indicators */}
                <div className="space-y-3 rounded-2xl bg-slate-100/50 border-2 border-slate-300/50 p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">🔒</span>
                    <div>
                      <p className="font-black text-slate-900 text-sm">Secure Payment</p>
                      <p className="text-xs text-slate-600 font-medium">256-bit SSL encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">✓</span>
                    <div>
                      <p className="font-black text-slate-900 text-sm">Satisfaction Guaranteed</p>
                      <p className="text-xs text-slate-600 font-medium">100% customer satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
