import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await serviceService.getServices();
      
      if (!Array.isArray(response.data)) {
        throw new Error('Expected array of services');
      }
      
      const validServices = response.data.filter(service => !!service.id);
      setServices(validServices);
    } catch (err) {
      setError('Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (serviceId) => {
    if (!serviceId) return;
    navigate(`/client/booking/${serviceId}`);
  };

  return (
    <ClientLayout title="Available Sessions">
      {error && (
        <div className="mb-12 p-6 bg-red-50 border border-red-100 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-red-800 mb-2">Notice</p>
            <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#C79F68] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Subtle Introduction */}
          <div className="text-center mb-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-4">Curated Experiences</p>
            <h2 className="text-3xl font-serif text-[#333] mb-6">Choose Your Session</h2>
            <p className="text-sm text-[#777] max-w-xl mx-auto leading-relaxed">
              Every moment is unique. Select a package that best fits your vision and let's create something beautiful together.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#EEE]">
              <p className="text-sm text-[#777] uppercase tracking-widest">No sessions currently available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {services.map((service) => {
                const serviceId = service.id.toString();
                return (
                  <div 
                    key={serviceId}
                    className="group bg-white border border-[#EEEEEE] p-12 transition-all duration-500 hover:shadow-premium flex flex-col h-full text-center"
                  >
                    {/* Category Label */}
                    {service.category && (
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C79F68] mb-6">
                        {service.category}
                      </p>
                    )}

                    {/* Title */}
                    <h3 className="text-3xl font-serif text-[#333] mb-8 group-hover:text-[#C79F68] transition-colors duration-300">
                      {service.name}
                    </h3>

                    {/* Service Image Preview */}
                    <div className="w-full aspect-[16/9] mb-8 bg-[#F9F9F9] overflow-hidden border border-[#EEEEEE] relative">
                      {service.image_path ? (
                        <img 
                          src={`http://localhost:8000/${service.image_path}`} 
                          alt={service.name}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">
                          <span className="text-2xl">📸</span>
                        </div>
                      )}
                    </div>

                    {/* Price & Duration */}
                    <div className="mb-8 flex flex-col items-center">
                      <p className="text-4xl font-serif text-[#333] mb-2 leading-none">
                        ₱{parseFloat(service.price).toLocaleString()}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#AAA]">
                        {service.duration} Minute Session
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-12 h-[1px] bg-[#EEEEEE] mx-auto mb-8"></div>

                    {/* Description */}
                    <p className="text-sm text-[#777] leading-relaxed mb-10 flex-1">
                      {service.description}
                    </p>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleBookNow(serviceId)}
                      className="w-full bg-transparent border border-[#333] py-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#333] transition-all duration-500 hover:bg-[#333] hover:text-white"
                    >
                      Book Session
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Trust Note */}
          <div className="mt-32 text-center">
            <div className="w-px h-16 bg-[#EEEEEE] mx-auto mb-8"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#AAA] font-bold">
              Secure Booking & Satisfaction Guaranteed
            </p>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
