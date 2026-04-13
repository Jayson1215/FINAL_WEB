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
      const response = await serviceService.getServices();
      setServices(response.data);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (serviceId) => {
    navigate(`/client/booking/${serviceId}`);
  };

  return (
    <ClientLayout title="Our Services">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-gray-700 text-lg">Loading services...</div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Elegant Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-12 shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2">Photography Services</p>
              <h1 className="text-6xl font-display font-bold text-white mb-3">Our Services</h1>
              <p className="text-slate-300 text-lg">Choose the perfect package for your photography session</p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-blue-200 relative flex flex-col"
              >
                {/* Service Header */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 text-7xl opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300">📸</div>
                  <h3 className="text-2xl font-display font-bold text-white relative mb-3">{service.name}</h3>
                  {service.category && (
                    <span className="inline-block px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
                      {service.category}
                    </span>
                  )}
                </div>

                {/* Service Details */}
                <div className="p-8 flex flex-col flex-1">
                  {/* Description */}
                  <p className="text-slate-700 mb-8 min-h-20 leading-relaxed font-medium">{service.description}</p>

                  {/* Duration and Price */}
                  <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200">
                    <div>
                      <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-2">Duration</p>
                      <p className="text-3xl font-display font-bold text-slate-900">{service.duration}</p>
                      <p className="text-slate-600 text-sm font-medium">minutes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-2">Price</p>
                      <p className="text-3xl font-display font-bold text-blue-600">${parseFloat(service.price).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mb-8 space-y-3">
                    <p className="text-slate-600 text-xs uppercase tracking-wider font-bold mb-4">What's Included</p>
                    {[1, 2, 3].map(i => (
                      <p key={i} className="text-slate-700 text-sm flex items-center gap-3">
                        <span className="text-blue-500 font-bold">✓</span>
                        Premium photos & prints
                      </p>
                    ))}
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBookNow(service.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 group-hover:shadow-lg font-display font-bold uppercase tracking-wider transition-all duration-300 text-sm mt-auto flex items-center justify-center gap-2"
                  >
                    <span>✨</span> Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loading && services.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-700 text-lg mb-6 font-medium">No services available at the moment.</p>
              <button 
                onClick={fetchServices}
                className="inline-block px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition uppercase tracking-wider text-sm"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
}
