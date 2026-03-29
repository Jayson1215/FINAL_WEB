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
      console.log('Services API Response:', response.data);
      console.log('Response data type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
      
      // Validate the response is an array
      if (!Array.isArray(response.data)) {
        throw new Error('Expected array of services');
      }
      
      // Validate each service has an ID
      const validServices = response.data.filter(service => {
        if (!service.id) {
          console.warn('Service without ID found:', service);
          return false;
        }
        return true;
      });
      
      console.log(`Loaded ${validServices.length}/${response.data.length} valid services`);
      setServices(validServices);
    } catch (err) {
      setError('Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (serviceId) => {
    console.log('handleBookNow called with serviceId:', serviceId, 'Type:', typeof serviceId);
    if (!serviceId || serviceId === '0' || serviceId === 0) {
      console.error('Invalid service ID:', serviceId);
      setError('Invalid service ID. Please refresh and try again.');
      return;
    }
    navigate(`/client/booking/${serviceId}`);
  };

  return (
    <ClientLayout title="Our Services">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading premium services...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Luxury Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-900 to-slate-800 p-16 shadow-2xl border border-amber-500/30">
            {/* Premium background effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-400 to-transparent opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-300 to-transparent opacity-10 rounded-full blur-3xl -ml-40 -mb-40"></div>
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%)'}}></div>
            
            <div className="relative z-10">
              <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full">
                <p className="text-amber-950 text-xs font-bold uppercase tracking-widest">✨ Premium Selection</p>
              </div>
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 mb-6 leading-tight">Exquisite Photography Experiences</h1>
              <p className="text-amber-100 text-lg font-light max-w-3xl leading-relaxed">Discover our curated collection of professional photography services, designed to capture your most precious moments with artistry and precision</p>
            </div>
          </div>

          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border-2 border-slate-200">
              <span className="text-6xl mb-6 block">📸</span>
              <p className="text-slate-700 text-xl mb-8 font-semibold">No services available at the moment</p>
              <button 
                onClick={fetchServices}
                className="inline-block px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition uppercase tracking-wider text-sm shadow-lg shadow-amber-500/30"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, index) => {
                const serviceId = service?.id?.toString();
                if (!serviceId || serviceId === '0' || serviceId === 'undefined') {
                  console.warn(`Service at index ${index} has invalid ID:`, service);
                  return null;
                }
                
                return (
                  <div 
                    key={serviceId}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 border border-slate-200/50 hover:border-amber-400/50 flex flex-col h-full backdrop-blur-sm"
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-white via-amber-100 to-transparent opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-all duration-500 group-hover:-top-48 group-hover:-right-40"></div>
                    
                    {/* Premium Header Gradient */}
                    <div className="bg-gradient-to-br from-slate-900 via-amber-800 to-slate-800 p-10 relative overflow-hidden h-56">
                      {/* Premium badge */}
                      <div className="absolute top-4 right-4 z-20">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900 text-xs font-black rounded-full uppercase tracking-wider shadow-lg">Premium</span>
                      </div>
                      
                      {/* Decorative icon */}
                      <div className="absolute -right-16 -top-16 text-9xl opacity-5 group-hover:opacity-15 group-hover:scale-110 transition-all duration-500">📷</div>
                      
                      <div className="relative z-10">
                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-50 to-amber-200 mb-4 group-hover:from-amber-50 group-hover:to-amber-100 transition-all">{service.name}</h3>
                        {service.category && (
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-amber-100 text-xs font-bold rounded-full uppercase tracking-wider border border-white/20">
                              {service.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col flex-1 space-y-6">
                      {/* Rich Description */}
                      <p className="text-slate-700 leading-relaxed text-sm line-clamp-3 font-medium">{service.description}</p>

                      {/* Elegant Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                      {/* Stats Grid - Premium Style */}
                      <div className="grid grid-cols-2 gap-6 py-2">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200/50 text-center">
                          <p className="text-slate-600 text-xs font-black uppercase tracking-widest mb-3">Session Length</p>
                          <div className="flex items-baseline justify-center gap-2">
                            <p className="text-4xl font-black text-slate-900">{service.duration}</p>
                            <p className="text-slate-600 text-sm font-bold">mins</p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200/50 text-center">
                          <p className="text-amber-900 text-xs font-black uppercase tracking-widest mb-3">Investment</p>
                          <p className="text-4xl font-black text-amber-600">₱{parseFloat(service.price).toFixed(0)}</p>
                        </div>
                      </div>

                      {/* Elegant Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>

                      {/* Premium Features */}
                      <div className="space-y-4">
                        <p className="text-slate-700 text-xs font-black uppercase tracking-widest">What's Included</p>
                        <div className="space-y-3">
                          {[
                            { icon: '⭐', text: 'Professional editing suite' },
                            { icon: '💎', text: 'High-resolution RAW files' },
                            { icon: '☁️', text: 'Cloud delivery portal' }
                          ].map((feature, i) => (
                            <p key={i} className="text-slate-700 text-sm font-medium flex items-center gap-3 group/feature">
                              <span className="text-lg group-hover/feature:scale-125 transition-transform">{feature.icon}</span>
                              {feature.text}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Premium CTA Button */}
                      <button
                        onClick={() => handleBookNow(serviceId)}
                        className="w-full mt-auto bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all duration-300 shadow-xl shadow-amber-500/30 hover:shadow-amber-600/50 border border-amber-400/30 hover:border-amber-300/50 group-hover:scale-105 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span className="relative">Reserve Your Session</span>
                      </button>
                      
                      {/* Trust indicator */}
                      <p className="text-center text-xs text-slate-500 font-medium">✓ Secure booking • Satisfaction guaranteed</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
}
