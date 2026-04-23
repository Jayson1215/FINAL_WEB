import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';

export default function ServicesList() {
  const [d, setD] = useState({ s: [], loading: true });
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try { const r = await serviceService.getServices(); setD({ s: r.data || [], loading: false }); }
      catch (e) { setD(p => ({ ...p, loading: false })); }
    })();
  }, []);

  return (
    <ClientLayout title="Our Collections">
      {d.loading ? <div className="h-96 flex items-center justify-center animate-pulse">Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
          {d.s.map(s => (
            <div key={s.id} onClick={() => nav(`/client/booking/${s.id}`)} className="bg-white rounded-[2rem] p-4 border hover:shadow-2xl transition-all cursor-pointer group">
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <img src={resolveServiceImageUrl(s)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest">{s.category}</div>
              </div>
              <div className="px-4 space-y-4">
                <h3 className="text-xl font-serif">{s.name}</h3>
                <p className="text-xs text-gray-500 italic line-clamp-2">"{s.description}"</p>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xl font-bold text-[#E8734A]">₱{parseFloat(s.price).toLocaleString()}</span>
                  <button className="bg-[#1E293B] text-white px-6 py-2 rounded-xl text-[9px] font-bold uppercase">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}
