import React, { useState, useEffect } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { portfolioService } from '../../services/portfolioService';

export default function PortfolioGallery() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getPortfolio();
      setPortfolio(response.data);
    } catch (err) {
      setError('Failed to load portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(portfolio.map(item => item.category).filter(Boolean))];
  const filteredPortfolio = selectedCategory === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === selectedCategory);

  return (
    <ClientLayout title="Our Gallery">
      {error && (
        <div className="mb-12 p-6 bg-red-50 border border-red-100 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-red-800 mb-2">Notice</p>
            <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-[#C79F68] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Subtle Introduction */}
          <div className="text-center mb-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-4">Visual Stories</p>
            <h2 className="text-3xl font-serif text-[#333] mb-6">Explore the Moments</h2>
            <div className="w-12 h-[1px] bg-[#C79F68] mx-auto opacity-40"></div>
          </div>

          {/* Minimalist Category Filter */}
          <div className="flex justify-center gap-10 flex-wrap mb-24 border-b border-[#EEEEEE] pb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-300 relative py-2 ${
                  selectedCategory === cat
                    ? 'text-[#C79F68]'
                    : 'text-[#AAA] hover:text-[#333]'
                }`}
              >
                {cat}
                {selectedCategory === cat && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C79F68]"></span>
                )}
              </button>
            ))}
          </div>

          {/* Spaced Gallery Grid */}
          {filteredPortfolio.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#EEEEEE]">
              <p className="text-[10px] uppercase tracking-widest text-[#AAA] font-bold">No pieces found in this collection</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {filteredPortfolio.map(item => (
                <div 
                  key={item.id} 
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative overflow-hidden mb-8 aspect-[4/5] bg-[#F9F9F9]">
                    <img
                      src={`http://localhost:8000/${item.image_url}`}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C79F68] mb-3">
                        {item.category || 'Editorial'}
                    </p>
                    <h3 className="text-xl font-serif text-[#333] mb-2 group-hover:text-[#C79F68] transition tracking-tight">
                        {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-32 text-center">
            <div className="w-px h-16 bg-[#EEEEEE] mx-auto mb-8"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#AAA] font-bold">
              Art in Every Frame
            </p>
          </div>
        </div>
      )}

      {/* Lightfolio Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-white/95 backdrop-blur-md z-[100] flex items-center justify-center p-8 md:p-20 overflow-y-auto"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="fixed top-12 right-12 text-[#333] text-2xl hover:text-[#C79F68] transition z-[110]"
          >
            ✕
          </button>
          
          <div className="max-w-6xl w-full flex flex-col md:flex-row gap-16 items-center" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-3/5">
              <img
                src={`http://localhost:8000/${selectedImage.image_url}`}
                alt={selectedImage.title}
                className="w-full h-auto shadow-premium"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="w-full md:w-2/5 text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C79F68] mb-6">
                    {selectedImage.category || 'Perspective'}
                </p>
                <h2 className="text-4xl font-serif text-[#333] mb-8 leading-tight">
                    {selectedImage.title}
                </h2>
                <div className="w-12 h-px bg-[#C79F68] mb-8 opacity-40"></div>
                <p className="text-sm text-[#777] leading-relaxed mb-12">
                    {selectedImage.description}
                </p>
                <button
                    onClick={() => setSelectedImage(null)}
                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333] border-b border-[#333] pb-1 hover:text-[#C79F68] hover:border-[#C79F68] transition"
                >
                    Close View
                </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
