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
    <ClientLayout title="Portfolio Gallery">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading gallery...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Professional Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 p-12 shadow-2xl shadow-emerald-500/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-3">Visual Gallery</p>
              <h1 className="text-5xl font-bold text-white mb-4">Our Portfolio</h1>
              <p className="text-emerald-50 text-lg font-medium max-w-2xl">Explore our finest work and be inspired by our creativity</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-400 hover:text-emerald-600'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filteredPortfolio.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <span className="text-5xl mb-3 block">🖼️</span>
              <p className="text-slate-700 text-lg mb-4 font-medium">No portfolio items in this category</p>
              <button 
                onClick={() => setSelectedCategory('all')}
                className="text-emerald-600 hover:text-emerald-700 transition text-sm font-bold uppercase tracking-wider"
              >
                View All Portfolio Items →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolio.map(item => (
                <div 
                  key={item.id} 
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-slate-200">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="w-full p-4 text-white">
                          <p className="text-sm font-semibold">Click to view</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.description}</p>
                      {item.category && (
                        <span className="inline-block mt-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Professional Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white hover:text-slate-200 text-3xl z-50 bg-black/30 hover:bg-black/50 w-12 h-12 flex items-center justify-center rounded-full transition"
            >
              ✕
            </button>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title}
                loading="lazy"
                className="w-full h-auto max-h-[70vh] object-cover"
              />
              <div className="p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  {selectedImage.title}
                </h2>
                <p className="text-slate-700 mb-6 leading-relaxed">{selectedImage.description}</p>
                {selectedImage.category && (
                  <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full uppercase tracking-wider">
                    {selectedImage.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
