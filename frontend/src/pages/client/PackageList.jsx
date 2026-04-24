import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { useAuth } from '../../contexts/AuthContext';
import { serviceService } from '../../services/serviceService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';

export default function PackageList() {
  const [d, setD] = useState({ list: [], loading: true, cat: 'All' });
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const r = await serviceService.getServices();
        setD(p => ({ ...p, list: r.data || [], loading: false }));
      } catch (e) {
        setD(p => ({ ...p, loading: false }));
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return d.list.filter(s => d.cat === 'All' || s.category === d.cat);
  }, [d.list, d.cat]);

  const formatDur = (m) => {
    const h = Math.floor(m / 60);
    const mins = m % 60;
    return `${h}:${mins.toString().padStart(2, '0')} hours`;
  };

  return (
    <ClientLayout title="Production Packages" hideHero={true}>

      {d.loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-black">Synchronizing Collections...</p>
        </div>
      ) : (
        <div className="animate-fadeIn pb-20 space-y-12">
          <div className="flex flex-wrap justify-center gap-3">
             {['All', ...new Set(d.list.map(s => s.category))].filter(Boolean).map(cat => (
               <button key={cat} onClick={() => setD(p => ({ ...p, cat }))} className={`px-8 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${d.cat === cat ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-black hover:bg-gray-50 border-2 border-black'}`}>
                 {cat} ({d.list.filter(s => cat === 'All' || s.category === cat).length})
               </button>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-black">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-black">No {d.cat} packages available.</p>
              </div>
            ) : (
              filtered.map(s => (
              <div key={s.id} onClick={() => { if (!user) { nav('/?login=true'); return; } nav(`/client/packages/book/${s.id}`); }} className="bg-white rounded-[2.5rem] p-5 border-2 border-black shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)] transition-all duration-700 cursor-pointer group flex flex-col h-[650px] overflow-hidden">
                <div className="relative overflow-hidden rounded-[1.8rem] h-64 shrink-0 mb-8">
                  <img src={resolveServiceImageUrl(s)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[7px] font-bold uppercase tracking-[0.2em] text-black shadow-sm border border-black">{s.category}</div>
                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg text-[7px] font-bold uppercase tracking-widest text-white border border-white/20">{formatDur(s.duration)}</div>
                </div>
                
                <div className="px-3 flex-1 flex flex-col">
                  <div className="space-y-4 mb-8">
                    <h3 className="text-2xl font-serif text-black leading-tight tracking-tighter group-hover:text-[#E8734A] transition-colors">{s.name}</h3>
                    <p className="text-[11px] text-black font-medium italic line-clamp-3 leading-relaxed">"{s.description}"</p>
                  </div>
                  
                  <div className="space-y-3 mb-8 flex-1">
                     <p className="text-[8px] font-bold text-[#E8734A] uppercase tracking-[0.3em]">Tier Inclusions</p>
                     <div className="space-y-1.5">
                        {s.inclusions?.split('\n').slice(0, 4).map((inc, i) => (
                          <div key={i} className="flex gap-2 items-start">
                             <div className="w-1 h-1 rounded-full bg-black mt-1.5"></div>
                             <p className="text-[10px] text-black font-medium leading-tight truncate">{inc.replace('• ', '')}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="mt-auto pt-8 border-t-2 border-black flex items-center justify-between">
                    <div className="flex flex-col">
                        <p className="text-[8px] font-bold text-black uppercase tracking-[0.2em] mb-1">Investment</p>
                        <p className="text-3xl font-bold text-black tracking-tighter leading-none">₱{parseFloat(s.price).toLocaleString()}</p>
                    </div>
                    <button className="bg-black text-white px-10 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest group-hover:bg-[#E8734A] transition-all shadow-lg">Book now</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      )}
    </ClientLayout>
  );
}
