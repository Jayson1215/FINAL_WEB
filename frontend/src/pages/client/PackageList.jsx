import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';

export default function PackageList() {
  const [d, setD] = useState({ list: [], loading: true });
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const r = await serviceService.getServices();
        setD({ list: r.data || [], loading: false });
      } catch (e) {
        setD(p => ({ ...p, loading: false }));
      }
    })();
  }, []);

  const formatDur = (m) => {
    const h = Math.floor(m / 60);
    const mins = m % 60;
    return `${h}:${mins.toString().padStart(2, '0')} hours`;
  };

  return (
    <ClientLayout title="Signature Collections" hideHero={true}>
      {d.loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black opacity-40">Loading Masterpieces...</p>
        </div>
      ) : (
        <div className="space-y-12 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {d.list.map(s => (
              <div key={s.id} onClick={() => nav(`/client/packages/book/${s.id}`)} className="bg-white rounded-[2.5rem] p-6 border border-black/10 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-[560px] overflow-hidden">
                <div className="relative overflow-hidden rounded-[2rem] mb-6 shadow-sm h-64 shrink-0">
                  <img src={resolveServiceImageUrl(s)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute top-4 left-4 bg-white border border-black/10 px-4 py-1.5 rounded-xl text-[7px] font-bold uppercase tracking-widest text-black shadow-lg">{s.category}</div>
                </div>
                
                <div className="px-2 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4 h-14 overflow-hidden">
                    <h3 className="text-xl font-serif text-black leading-tight tracking-tighter line-clamp-2 pr-4">{s.name}</h3>
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border border-black/5 shrink-0">
                        <p className="text-[7px] font-bold text-black opacity-40 uppercase tracking-widest">{formatDur(s.duration)}</p>
                    </div>
                  </div>
                  
                  <div className="h-12 overflow-hidden mb-6">
                    <p className="text-[11px] text-black font-medium italic line-clamp-2 leading-relaxed opacity-60">"{s.description}"</p>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-black/5 h-20 flex items-center justify-between">
                    <div className="flex flex-col justify-center">
                        <p className="text-[7px] font-bold text-black opacity-30 uppercase tracking-[0.3em] mb-0.5">Investment</p>
                        <p className="text-2xl font-bold text-black tracking-tighter leading-none">₱{parseFloat(s.price).toLocaleString()}</p>
                    </div>
                    <button className="bg-black text-white w-[75px] h-[30px] rounded-lg text-[7px] font-bold uppercase tracking-widest group-hover:bg-[#E8734A] transition-all shadow-lg shrink-0 flex items-center justify-center">Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
