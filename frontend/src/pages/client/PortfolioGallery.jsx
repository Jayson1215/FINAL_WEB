import React, { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { portfolioService } from '../../services/portfolioService';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function PortfolioGallery() {
  const [d, setD] = useState({ list: [], cat: 'all', img: null, loading: true });

  useEffect(() => {
    (async () => {
      try { const r = await portfolioService.getPortfolio(); setD(p => ({ ...p, list: r.data || [], loading: false })); }
      catch (e) { setD(p => ({ ...p, loading: false })); }
    })();
  }, []);

  const cats = ['all', ...new Set(d.list.map(i => i.category).filter(Boolean))];
  const filtered = d.cat === 'all' ? d.list : d.list.filter(i => i.category === d.cat);

  return (
    <ClientLayout title="Masterpiece Gallery">
      {d.loading ? <div className="h-96 flex items-center justify-center animate-pulse">Loading Gallery...</div> : (
        <div className="space-y-12 animate-fadeIn">
          <div className="flex justify-center gap-2 flex-wrap bg-white p-2 rounded-2xl border w-fit mx-auto">
            {cats.map(c => (<button key={c} onClick={() => setD(p => ({ ...p, cat: c }))} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${d.cat === c ? 'bg-[#1E293B] text-white' : 'text-gray-400 hover:text-black'}`}>{c}</button>))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map(i => (
              <div key={i.id} onClick={() => setD(p => ({ ...p, img: i }))} className="group bg-white p-4 rounded-[2rem] border cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6"><img src={resolveImageUrl(i.image_url)} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" /></div>
                <div className="text-center"><p className="text-[9px] font-bold text-[#E8734A] uppercase tracking-widest">{i.category}</p><h3 className="text-lg font-serif">{i.title}</h3></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {d.img && (
        <div className="fixed inset-0 bg-[#F0F2F5]/98 backdrop-blur-xl z-[200] flex items-center justify-center p-6" onClick={() => setD(p => ({ ...p, img: null }))}>
          <div className="max-w-5xl w-full flex flex-col md:flex-row gap-12 items-center" onClick={e => e.stopPropagation()}>
            <img src={resolveImageUrl(d.img.image_url)} className="w-full md:w-1/2 rounded-[2rem] shadow-2xl" />
            <div className="space-y-6">
              <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-widest">{d.img.category}</p>
              <h2 className="text-5xl font-serif">{d.img.title}</h2>
              <p className="text-sm italic text-gray-500">"{d.img.description}"</p>
              <button onClick={() => setD(p => ({ ...p, img: null }))} className="bg-[#1E293B] text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest">Close</button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
