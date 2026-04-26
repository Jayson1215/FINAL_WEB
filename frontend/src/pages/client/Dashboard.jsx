import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import { portfolioService } from '../../services/portfolioService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';
import ClientLayout from '../../components/layout/ClientLayout';

export default function ClientDashboard() {
  const [data, setData] = useState({ s: [], b: [], p: [], loading: true });
  const [ui, setUi] = useState({ galleryItem: null, category: 'All' });
  const nav = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, b, p] = await Promise.all([
          serviceService.getServices(),
          bookingService.getMyBookings(),
          portfolioService.getPortfolio()
        ]);
        setData({ s: s.data || [], b: b.data || [], p: p.data || [], loading: false });
      } catch (e) { setData(p => ({ ...p, loading: false })); }
    };
    fetch();
  }, []);

  const formatDur = (m) => {
    const h = Math.floor(m / 60);
    const mins = m % 60;
    return `${h}:${mins.toString().padStart(2, '0')} hours`;
  };

  return (
    <ClientLayout title="Capturing Life at Your Place." fullHero={true} fullWidth={true}>
      <div className="space-y-20 px-6 md:px-12 max-w-7xl mx-auto pb-40">
        
        {/* Signature Packages Card */}
        <section id="services" className="scroll-mt-28 bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-16 shadow-sm border border-black/10 reveal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="space-y-3 md:space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">The Collection</p>
              <h2 className="text-3xl md:text-4xl font-serif text-black underline decoration-black/5">Signature Packages</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
               {['All', ...new Set(data.s.map(s => s.category))].filter(Boolean).map(cat => (
                 <button key={cat} onClick={() => setUi(p => ({ ...p, category: cat }))} className={`px-6 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${ui.category === cat ? 'bg-black text-white shadow-xl scale-105' : 'bg-white text-black hover:bg-slate-50 border border-black/10'}`}>
                   {cat}
                 </button>
               ))}
            </div>
          </div>

          {data.loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black opacity-40">Syncing Masterpieces...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
              {data.s.filter(s => ui.category === 'All' || s.category === ui.category).length === 0 ? (
                <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-black/10">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-black opacity-40">No {ui.category} collections available at the moment.</p>
                </div>
              ) : (
                data.s.filter(s => ui.category === 'All' || s.category === ui.category).map(s => (
                  <div key={s.id} onClick={() => nav(`/client/packages/book/${s.id}`)} className="bg-white rounded-[2.5rem] p-6 md:p-8 border-2 border-black shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)] transition-all duration-700 cursor-pointer group flex flex-col min-h-[680px] md:h-[720px] overflow-hidden">
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
                                  <div className="w-1 h-1 rounded-full bg-black mt-1.5 opacity-40"></div>
                                  <p className="text-[10px] text-black font-medium leading-tight truncate">{inc.replace('• ', '')}</p>
                               </div>
                            ))}
                         </div>
                      </div>
                      
                      <div className="mt-auto pt-8 border-t-2 border-black flex items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-[8px] font-bold text-black opacity-50 uppercase tracking-[0.2em] mb-1">Investment</p>
                            <p className="text-xl font-bold text-black tracking-tight leading-none">₱{parseFloat(s.price).toLocaleString()}</p>
                        </div>
                        <button className="bg-black text-white px-8 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] group-hover:bg-[#E8734A] transition-all shadow-lg">Book Now</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* Gallery Section Card */}
        <section id="gallery" className="scroll-mt-28 bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-16 shadow-sm border border-black/10 reveal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-16 mb-12 md:mb-16">
            <div className="space-y-3 md:space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Inspiration</p>
              <h2 className="text-3xl md:text-4xl font-serif text-black underline decoration-black/5">Recent Masterpieces</h2>
            </div>
            <button onClick={() => nav('/client/Gallery')} className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#E8734A] hover:border-[#E8734A] transition-all">Full Portfolio</button>
          </div>
          
          {data.loading ? (
             <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black/5 border-t-black rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10 animate-fadeIn">
              {data.p.slice(0, 6).map(item => (
                <div key={item.id} onClick={() => setUi(p => ({ ...p, galleryItem: item }))} className="relative rounded-[2.5rem] overflow-hidden group cursor-pointer border border-black/5">
                  <img src={item.image_url} alt={item.title} className="w-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 md:p-10 flex flex-col justify-end">
                    <p className="text-[9px] md:text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.4em] mb-2">{item.category}</p>
                    <h4 className="text-white font-serif text-xl md:text-2xl">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Gallery Detail Modal */}
      {ui.galleryItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl z-[600] flex items-center justify-center p-4 md:p-6 animate-fadeIn" onClick={() => setUi(p => ({ ...p, galleryItem: null }))}>
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 md:gap-10 items-center bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-black/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setUi(p => ({ ...p, galleryItem: null }))} className="absolute top-6 right-6 md:top-8 md:right-8 text-2xl text-black/20 hover:text-black transition-all">×</button>
            <div className="relative rounded-[2rem] overflow-hidden shadow-xl border border-black/5">
              <img src={ui.galleryItem.image_url} alt={ui.galleryItem.title} className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain" />
            </div>
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-2 md:space-y-3">
                <p className="text-[9px] md:text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.5em]">{ui.galleryItem.category}</p>
                <h2 className="text-3xl md:text-4xl font-serif text-black leading-tight tracking-tighter">{ui.galleryItem.title}</h2>
                <div className="w-10 md:w-12 h-[1px] bg-black"></div>
              </div>
              <p className="text-xs md:text-[13px] text-black italic leading-relaxed font-medium opacity-60">"{ui.galleryItem.description || 'A captured moment of pure authenticity and light.'}"</p>
              <div className="pt-4 md:pt-6">
                <button onClick={() => setUi(p => ({ ...p, galleryItem: null }))} className="w-full md:w-auto bg-black text-white px-10 py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-lg">Close Masterpiece</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
