import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import { portfolioService } from '../../services/portfolioService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';
import ClientLayout from '../../components/layout/ClientLayout';

export default function ClientDashboard() {
  const [data, setData] = useState({ s: [], b: [], p: [], loading: true });
  const [ui, setUi] = useState({ galleryItem: null });
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
        
        {/* Active Services Card */}
        <section id="services" className="scroll-mt-28 bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-black/10 reveal">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">The Collection</p>
              <h2 className="text-4xl font-serif text-black underline decoration-black/5">Signature Packages</h2>
            </div>
            <button onClick={() => nav('/client/Packages')} className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#E8734A] hover:border-[#E8734A] transition-all">All Collections</button>
          </div>

          {data.loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-slate-100 border-t-black rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black opacity-40">Syncing Masterpieces...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fadeIn">
              {data.s.slice(0, 4).map(s => (
                <div key={s.id} onClick={() => nav(`/client/packages/book/${s.id}`)} className="bg-white rounded-[2.5rem] p-4 border border-black/10 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-[460px] overflow-hidden">
                  <div className="relative overflow-hidden rounded-[1.5rem] mb-5 h-48 shrink-0">
                    <img src={resolveServiceImageUrl(s)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 left-4 bg-white border border-black/10 px-3 py-1 rounded-lg text-[7px] font-bold uppercase tracking-widest text-black shadow-sm">{s.category}</div>
                  </div>
                  <div className="px-2 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3 h-12 overflow-hidden">
                      <h3 className="text-lg font-serif text-black leading-tight line-clamp-2 pr-2">{s.name}</h3>
                      <p className="text-[7px] font-bold text-black opacity-40 uppercase tracking-widest shrink-0 ml-2">{formatDur(s.duration)}</p>
                    </div>
                    <div className="h-10 overflow-hidden mb-4">
                      <p className="text-[10px] text-black font-medium italic line-clamp-2 leading-relaxed opacity-60">"{s.description}"</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-black/5 h-16 flex items-center justify-between">
                      <div className="flex flex-col justify-center">
                        <p className="text-[7px] font-bold text-black opacity-30 uppercase tracking-widest mb-1">Investment</p>
                        <p className="text-lg font-bold text-black tracking-tight leading-none">₱{parseFloat(s.price).toLocaleString()}</p>
                      </div>
                      <button className="bg-black text-white w-[75px] h-[30px] rounded-lg text-[7px] font-bold uppercase tracking-widest group-hover:bg-[#E8734A] transition-all flex items-center justify-center shrink-0">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gallery Section Card */}
        <section id="gallery" className="scroll-mt-28 bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-black/10 reveal">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Inspiration</p>
              <h2 className="text-4xl font-serif text-black underline decoration-black/5">Recent Masterpieces</h2>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-10 flex flex-col justify-end">
                    <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.4em] mb-2">{item.category}</p>
                    <h4 className="text-white font-serif text-2xl">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Gallery Detail Modal */}
      {ui.galleryItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl z-[600] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setUi(p => ({ ...p, galleryItem: null }))}>
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center bg-white p-8 md:p-10 rounded-[3rem] border border-black/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setUi(p => ({ ...p, galleryItem: null }))} className="absolute top-8 right-8 text-2xl text-black/20 hover:text-black transition-all">×</button>
            <div className="relative rounded-[2rem] overflow-hidden shadow-xl border border-black/5">
              <img src={ui.galleryItem.image_url} alt={ui.galleryItem.title} className="w-full h-auto max-h-[60vh] object-contain" />
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-[0.5em]">{ui.galleryItem.category}</p>
                <h2 className="text-4xl font-serif text-black leading-tight tracking-tighter">{ui.galleryItem.title}</h2>
                <div className="w-12 h-[1px] bg-black"></div>
              </div>
              <p className="text-[13px] text-black italic leading-relaxed font-medium opacity-60">"{ui.galleryItem.description || 'A captured moment of pure authenticity and light.'}"</p>
              <div className="pt-6 flex gap-4">
                <button onClick={() => setUi(p => ({ ...p, galleryItem: null }))} className="bg-black text-white px-8 py-3.5 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-lg">Close</button>
                <button onClick={() => { setUi(p => ({ ...p, galleryItem: null })); nav('/client/Packages'); }} className="px-8 py-3.5 border border-black rounded-xl text-[9px] font-bold uppercase tracking-widest text-black hover:bg-slate-50 transition-all">View Packages</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
