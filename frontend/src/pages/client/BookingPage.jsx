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
      const response = await serviceService.getServiceDetail(serviceId);
      if (!response.data) throw new Error('Service data is empty');
      setService(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load service details.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getAvailableTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to make a booking.');
        setSubmitting(false);
        return;
      }

      const bookingPayload = {
        service_id: serviceId,
        booking_date: formData.bookingDate,
        booking_time: formData.bookingTime,
        special_requests: formData.specialRequests,
        total_amount: typeof service.price === 'string' ? parseFloat(service.price.replace(/,/g, '')) : service.price,
        add_on_ids: [],
      };
      
      const response = await bookingService.createBooking(bookingPayload);
      sessionStorage.setItem('bookingData', JSON.stringify(response.data));
      navigate('/client/checkout');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout title="Reserve Session">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#C79F68] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ClientLayout>
    );
  }

  if (!service) {
    return (
      <ClientLayout title="Session Not Found">
        <div className="text-center py-20 border border-dashed border-[#EEE]">
          <p className="text-sm text-[#777] uppercase tracking-widest mb-8">This session is no longer available</p>
          <button
            onClick={() => navigate('/client/services')}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333] border-b border-[#333] pb-1"
          >
            Browse Other Services
          </button>
        </div>
      </ClientLayout>
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <ClientLayout title="Your Details">
      <div className="max-w-4xl mx-auto">
        {error && (
            <div className="mb-12 p-6 bg-red-50 border border-red-100 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-red-800 mb-2">Notice</p>
                <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
        )}

        {/* Multi-step flow indicator (Subtle) */}
        <div className="flex justify-center items-center space-x-4 mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C79F68]">1. Package</span>
            <span className="w-8 h-px bg-[#EEEEEE]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#333]">2. Details</span>
            <span className="w-8 h-px bg-[#EEEEEE]"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AAA]">3. Confirmation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Booking Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-16">
              {/* Selected Summary (Non-intrusive) */}
              <div className="pb-16 border-b border-[#EEEEEE]">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C79F68] mb-4">Selected Session</p>
                <h3 className="text-3xl font-serif text-[#333] mb-4">{service.name}</h3>
                <p className="text-sm text-[#777] leading-relaxed italic">
                    "{service.description}"
                </p>
              </div>

              {/* Date Selection */}
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                    <span className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-[10px] font-bold mt-1">01</span>
                    <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#333]">
                      Choose Your Date
                    </label>
                </div>
                <input
                  type="date"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  min={minDate}
                  required
                  className="w-full bg-white border border-[#EEEEEE] px-8 py-6 text-sm text-[#333] focus:border-[#C79F68] outline-none transition duration-500"
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                    <span className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-[10px] font-bold mt-1">02</span>
                    <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#333]">
                        Select Time Slot
                    </label>
                </div>
                {formData.bookingDate ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getAvailableTimeSlots().map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bookingTime: slot }))}
                        className={`py-4 text-[11px] font-bold uppercase tracking-widest border transition duration-500 ${
                          formData.bookingTime === slot 
                            ? 'bg-[#333] text-white border-[#333]' 
                            : 'bg-white text-[#777] border-[#EEEEEE] hover:border-[#333]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] uppercase tracking-widest text-[#AAA] italic py-8 border border-dashed border-[#EEEEEE] text-center">
                    Please select a date first
                  </p>
                )}
              </div>

              {/* Special Requests */}
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                    <span className="w-8 h-8 rounded-full border border-[#333] flex items-center justify-center text-[10px] font-bold mt-1">03</span>
                    <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#333]">
                      Optional Notes
                    </label>
                </div>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Share any special preferences or vision for your session..."
                  className="w-full bg-white border border-[#EEEEEE] px-8 py-6 text-sm text-[#333] focus:border-[#C79F68] outline-none transition duration-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.bookingTime}
                className="w-full bg-[#333] text-white py-6 text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C79F68] transition duration-500"
              >
                {submitting ? 'Processing Session...' : 'Continue to Checkout'}
              </button>
            </form>
          </div>

          {/* Minimalist Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#EEEEEE] p-12 sticky top-32">
                <h3 className="text-xl font-serif text-[#333] mb-8 pb-6 border-b border-[#EEEEEE]">
                    Summary
                </h3>
                
                <div className="space-y-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-2">Investment</p>
                        <p className="text-2xl font-serif text-[#333]">₱{parseFloat(service.price).toLocaleString()}</p>
                    </div>
                    
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-2">Session</p>
                        <p className="text-sm text-[#333] font-medium">{service.name}</p>
                        <p className="text-[11px] text-[#777] mt-1">{service.duration} Minutes</p>
                    </div>

                    {formData.bookingDate && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] mb-2">Schedule</p>
                            <p className="text-sm text-[#333] font-medium">
                                {new Date(formData.bookingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                            {formData.bookingTime && (
                                <p className="text-[11px] text-[#C79F68] mt-1 font-bold">{formData.bookingTime}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-[#EEEEEE]">
                    <p className="text-[10px] uppercase tracking-widest text-[#AAA] font-bold italic">
                        Price includes professional editing and digital delivery.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
