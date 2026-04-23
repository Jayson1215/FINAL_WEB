import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import LocationPickerMap from '../../components/common/LocationPickerMap';

export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    bookingDate: '',
    bookingTime: '',
    location: '',
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

  const handleMapLocationPick = ({ lat, lng, address }) => {
    const coordinateSuffix = `(${lat.toFixed(6)}, ${lng.toFixed(6)})`;
    const locationValue = address ? `${address} ${coordinateSuffix}` : coordinateSuffix;
    setFormData(prev => ({ ...prev, location: locationValue }));
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
        location: formData.location,
        special_requests: formData.specialRequests,
        total_amount: typeof service.price === 'string' ? parseFloat(service.price.replace(/,/g, '')) : service.price,
        add_on_ids: [],
      };
      
      const response = await bookingService.createBooking(bookingPayload);
      navigate(`/client/bookings?booking=${response.data.id}&highlight=1`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout title="Reserve Package">
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin"></div>
        </div>
      </ClientLayout>
    );
  }

  if (!service) {
    return (
      <ClientLayout title="Session Not Found">
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#E2E8F0] shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#94A3B8] mb-8">This session is no longer available</p>
          <button
            onClick={() => navigate('/client/services')}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8734A] border-b border-[#E8734A] pb-1 hover:opacity-70 transition"
          >
            Browse Other Packages
          </button>
        </div>
      </ClientLayout>
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <ClientLayout title="Reserve Your Package">
      <div className="max-w-6xl mx-auto">
        {error && (
            <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-2xl text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">System Notice</p>
                <p className="text-sm text-red-500 font-medium">{error}</p>
            </div>
        )}

        {/* Multi-step flow indicator */}
        <div className="flex justify-center items-center gap-6 mb-16">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E8734A] text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E293B]">Package</span>
            </div>
            <div className="w-12 h-px bg-[#E2E8F0]"></div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full border-2 border-[#E8734A] text-[#E8734A] flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E293B]">Details</span>
            </div>
            <div className="w-12 h-px bg-[#E2E8F0]"></div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#F0F2F5] text-[#94A3B8] flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8]">Confirm</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Booking Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Selected Summary */}
              <div className="bg-white rounded-2xl p-8 shadow-card border border-[#F1F5F9] relative overflow-hidden group">
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-[#E8734A]/5 rounded-full blur-2xl"></div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8734A] mb-3">Selected Package</p>
                <h3 className="text-3xl font-serif text-[#1E293B] mb-3 group-hover:text-[#E8734A] transition-colors">{service.name}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed italic mb-6">
                    "{service.description}"
                </p>
                {service.inclusions && (
                  <div className="pt-6 border-t border-[#F1F5F9]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-3">What's Included:</p>
                    <p className="text-[12px] text-[#1E293B] font-medium leading-relaxed whitespace-pre-line">{service.inclusions}</p>
                  </div>
                )}
              </div>

              {/* Form Fields Card */}
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-card border border-[#F1F5F9] space-y-10">
                {/* Date Selection */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-xl bg-[#F0F2F5] flex items-center justify-center text-[#1E293B] text-xs font-bold shadow-sm">01</span>
                      <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1E293B]">
                        Choose Your Date
                      </label>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      min={minDate}
                      required
                      className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-6 py-4 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-xl bg-[#F0F2F5] flex items-center justify-center text-[#1E293B] text-xs font-bold shadow-sm">02</span>
                      <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1E293B]">
                          Session Start Time
                      </label>
                  </div>
                  <input
                    type="time"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-6 py-4 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all"
                  />
                </div>

                {/* Event Location */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-xl bg-[#F0F2F5] flex items-center justify-center text-[#1E293B] text-xs font-bold shadow-sm">03</span>
                      <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1E293B]">
                        Event Location
                      </label>
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter the full address or venue name..."
                    className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-6 py-4 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all placeholder:text-[#94A3B8]"
                  />
                  <LocationPickerMap locationText={formData.location} onLocationSelect={handleMapLocationPick} height="240px" />
                </div>

                {/* Special Requests */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-xl bg-[#F0F2F5] flex items-center justify-center text-[#1E293B] text-xs font-bold shadow-sm">04</span>
                      <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1E293B]">
                        Additional Notes
                      </label>
                  </div>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Share any special preferences or vision for your session..."
                    className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-6 py-4 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all resize-none placeholder:text-[#94A3B8]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.bookingTime}
                className="w-full bg-gradient-to-r from-[#1E293B] to-[#334155] text-white py-6 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-xl hover:translate-y-[-2px] transition-all duration-500 flex items-center justify-center gap-3 shadow-lg"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : 'Submit Booking Request'}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-2xl shadow-premium border border-[#F1F5F9] p-8 md:p-10 sticky top-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8734A]/5 rounded-full -mr-12 -mt-12"></div>
                <h3 className="text-xl font-serif text-[#1E293B] mb-8 pb-4 border-b border-[#F1F5F9] flex items-center gap-3">
                    <span className="text-[#E8734A]">✦</span> Summary
                </h3>
                
                <div className="space-y-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-3 flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#E8734A] rounded-full"></span> Investment
                        </p>
                        <p className="text-3xl font-serif text-[#1E293B]">₱{parseFloat(service.price).toLocaleString()}</p>
                        <p className="text-[10px] text-[#E8734A] font-bold mt-1 uppercase tracking-widest">{service.downpayment_rate}% downpayment required</p>
                    </div>
                    
                    <div className="bg-[#F8F9FB] p-5 rounded-2xl border border-[#F1F5F9]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-3">Package Details</p>
                        <p className="text-sm text-[#1E293B] font-bold mb-1">{service.name}</p>
                        <p className="text-[11px] text-[#64748B] flex items-center gap-2">
                          <span className="text-[#E8734A]">🕒</span> {service.duration} Minutes Session
                        </p>
                    </div>

                    {formData.bookingDate && (
                        <div className="bg-[#FFF7ED] p-5 rounded-2xl border border-[#FFE7CC]">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8734A] mb-3">Schedule</p>
                            <div className="flex items-start gap-3">
                              <span className="text-xl">📅</span>
                              <div>
                                <p className="text-sm text-[#1E293B] font-bold">
                                    {new Date(formData.bookingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                {formData.bookingTime && (
                                    <p className="text-[11px] text-[#E8734A] mt-1 font-bold tracking-widest uppercase">{formData.bookingTime}</p>
                                )}
                              </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-[#F1F5F9] text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] font-bold italic leading-relaxed">
                        Professional editing and digital delivery included in all packages.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
