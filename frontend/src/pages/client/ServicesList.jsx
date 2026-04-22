import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';

function getImageFilename(value) {
  if (!value) return '';
  try {
    const raw = String(value).trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) {
      const parsed = new URL(raw);
      return parsed.pathname.split('/').filter(Boolean).pop() || '';
    }
    return raw.replace(/^\/+/, '').split('/').filter(Boolean).pop() || '';
  } catch {
    return '';
  }
}

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchServices(); }, []);
  const fetchServices = async () => {
    try { setLoading(true); const r = await serviceService.getServices(); setServices(r.data); }
    catch (e) { setError('Failed to load packages'); } finally { setLoading(false); }
  };

  const handleBookNow = (id) => navigate(`/client/booking/${id}`);
  const getServiceImageUrl = (path) => {
    const filename = getImageFilename(path);
    return filename ? `/images/${filename}` : '/images/studio-hero.png';
  };

  const setImageFallback = (event) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied === '1') return;
    target.dataset.fallbackApplied = '1';
    target.src = '/images/studio-hero.png';
  };

  return (
    <ClientLayout title="Our Packages">
      {error && (<div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-2xl text-center text-red-500 shadow-sm">{error}</div>)}

      {loading ? (
        <div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin"></div></div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-16 animate-fadeIn">


          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service) => {
              const serviceImageUrl = getServiceImageUrl(service.image_path);
              return (
                <div key={service.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-card hover:shadow-card-hover border border-[#F1F5F9] transition-all duration-500 flex flex-col hover:border-[#E8734A]/20">
                  {/* Image Area */}
                  <div className="relative h-72 bg-[#F8F9FB] overflow-hidden">
                    {serviceImageUrl ? (
                      <img src={serviceImageUrl} alt={service.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={setImageFallback} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#E2E8F0] text-6xl">📸</div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/95 backdrop-blur rounded-xl shadow-md text-[10px] font-bold uppercase tracking-wider text-[#1E293B] border border-[#F1F5F9]">
                        {service.category || 'Package'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
                       <h3 className="text-2xl font-serif text-white">{service.name}</h3>
                    </div>
                  </div>

                  {/* Details Area */}
                  <div className="p-8 flex flex-col flex-1 space-y-6">
                    <p className="text-[#64748B] text-sm leading-relaxed line-clamp-2 italic">"{service.description}"</p>
                    
                    {service.inclusions && (
                       <div className="p-5 bg-[#F8F9FB] rounded-2xl border border-[#F1F5F9]">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E8734A] mb-2">Inclusions:</p>
                          <p className="text-[11px] text-[#64748B] leading-relaxed line-clamp-3 whitespace-pre-line">{service.inclusions}</p>
                       </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-[#F1F5F9] mt-auto">
                      <div className="space-y-1">
                        <p className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-widest">Duration</p>
                        <p className="text-xl font-bold text-[#1E293B] flex items-baseline gap-1">{service.duration} <span className="text-[10px] font-normal text-[#94A3B8] uppercase">min</span></p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-widest">Investment</p>
                        <p className="text-2xl font-serif font-bold text-[#E8734A]">₱{parseFloat(service.price).toLocaleString()}</p>
                      </div>
                    </div>

                    <button onClick={() => handleBookNow(service.id)} className="w-full bg-gradient-to-r from-[#1E293B] to-[#334155] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-500 flex items-center justify-center gap-3 group/btn">
                      Request This Package
                      <span className="transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && services.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-[#E2E8F0] shadow-card">
              <p className="text-[#64748B] mb-8 font-serif italic text-lg">No packages available at the moment.</p>
              <button onClick={fetchServices} className="bg-[#1E293B] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:shadow-xl transition shadow-lg text-[11px]">Refresh Collection</button>
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
}
