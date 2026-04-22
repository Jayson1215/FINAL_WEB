import React, { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { portfolioService } from '../../services/portfolioService';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function PortfolioGallery() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchPortfolio(); }, []);
  const fetchPortfolio = async () => {
    try { setLoading(true); const r = await portfolioService.getPortfolio(); setPortfolio(r.data); }
    catch (e) { setError('Failed to load portfolio'); } finally { setLoading(false); }
  };

  const categories = ['all', ...new Set(portfolio.map(item => item.category).filter(Boolean))];
  const filteredPortfolio = selectedCategory === 'all' ? portfolio : portfolio.filter(item => item.category === selectedCategory);
  const getPortfolioImageUrl = (path) => resolveImageUrl(path);

  const setImageFallback = (event, fallbackSrc) => {
    const target = event.currentTarget;
    if (target.dataset.fallbackApplied === '1') return;
    target.dataset.fallbackApplied = '1';
    target.src = fallbackSrc;
  };

  return (
    <ClientLayout title="Our Gallery">
      {error && (<div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-2xl text-center text-red-500 shadow-sm">{error}</div>)}

      {loading ? (
        <div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin"></div></div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-16 animate-fadeIn">


          {/* Category Filter */}
          <div className="flex justify-center gap-2 flex-wrap mb-10 bg-white p-2 rounded-2xl shadow-card border border-[#F1F5F9] w-fit mx-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 rounded-xl ${
                  selectedCategory === cat ? 'bg-[#1E293B] text-white shadow-lg' : 'text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8F9FB]'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filteredPortfolio.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-[#E2E8F0] shadow-card">
              <p className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-bold">No pieces found in this collection</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPortfolio.map(item => (
                <div key={item.id} className="group cursor-pointer bg-white rounded-3xl p-4 shadow-card hover:shadow-card-hover border border-[#F1F5F9] transition-all duration-500" onClick={() => setSelectedImage(item)}>
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#F8F9FB] mb-6">
                    <img src={getPortfolioImageUrl(item.image_url)} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" onError={(e) => setImageFallback(e, '/images/featured-work.png')} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">View Masterpiece</p>
                    </div>
                  </div>
                  <div className="text-center px-2 pb-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E8734A] mb-2">{item.category || 'Editorial'}</p>
                    <h3 className="text-xl font-serif text-[#1E293B] group-hover:text-[#E8734A] transition-colors">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center py-20">
            <div className="w-px h-20 bg-gradient-to-b from-[#E2E8F0] to-transparent mx-auto mb-6"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#94A3B8] font-bold">Art in Every Frame</p>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-[#F0F2F5]/98 backdrop-blur-xl z-[100] flex items-center justify-center p-6 md:p-16 overflow-y-auto animate-fadeIn" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="fixed top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1E293B] text-xl shadow-premium border border-[#E2E8F0] hover:bg-[#E8734A] hover:text-white transition-all z-[110]">✕</button>
          <div className="max-w-6xl w-full flex flex-col md:flex-row gap-12 lg:gap-20 items-center animate-slideIn" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-[55%]">
              <div className="bg-white p-4 rounded-3xl shadow-premium border border-[#F1F5F9]">
                <img src={getPortfolioImageUrl(selectedImage.image_url)} alt={selectedImage.title} className="w-full h-auto rounded-2xl shadow-sm" onError={(e) => setImageFallback(e, '/images/featured-work.png')} />
              </div>
            </div>
            <div className="w-full md:w-[45%] text-left space-y-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-4">Perspective • {selectedImage.category || 'Series'}</p>
                  <h2 className="text-5xl font-serif text-[#1E293B] leading-[1.1]">{selectedImage.title}</h2>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-[#E8734A] to-[#FB923C] rounded-full"></div>
                <p className="text-base text-[#64748B] leading-relaxed italic font-medium">"{selectedImage.description}"</p>
                <div className="pt-8">
                  <button onClick={() => setSelectedImage(null)} className="bg-[#1E293B] text-white px-10 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:shadow-xl transition-all shadow-lg">Close Masterpiece</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
