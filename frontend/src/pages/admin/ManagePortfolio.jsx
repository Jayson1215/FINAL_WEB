import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { portfolioService } from '../../services/portfolioService';

export default function ManagePortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getAllPortfolio();
      setPortfolio(response.data);
    } catch (err) {
      setError('Failed to load portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      // Optimistic delete
      const previousPortfolio = portfolio;
      setPortfolio(portfolio.filter(item => item.id !== id));
      
      // Then sync with backend
      await portfolioService.deletePortfolioItem(id);
      // Success, UI already updated
      setError('');
    } catch (err) {
      // Revert on error
      setPortfolio(previousPortfolio);
      setError('Failed to delete portfolio item');
    }
  };

  if (loading && portfolio.length === 0) {
    return (
      <AdminLayout title="Manage Portfolio">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading portfolio...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Studio Gallery">
      {error && (
        <div className="mb-10 p-6 bg-red-50 border-l-2 border-red-200">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">Notice</p>
          <p className="text-sm text-red-800 font-serif italic">{error}</p>
        </div>
      )}

      <div className="space-y-16 animate-fadeIn">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#EEEEEE] pb-10 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-tight mb-4">Portfolio Showcase</h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C79F68]">Curating the visual narrative of your studio's finest works.</p>
          </div>
          <button className="px-10 py-5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C79F68] transition-all duration-700 shadow-sm active:scale-[0.98]">
            Add Masterpiece
          </button>
        </div>

        {/* Portfolio Grid - Minimalist Gallery Style */}
        {portfolio.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[#EEEEEE]">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#BBB]">The exhibition is currently empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#EEEEEE] divide-y md:divide-y-0 md:divide-x divide-[#EEEEEE]">
            {portfolio.map(item => (
              <div key={item.id} className="bg-white p-10 group hover:bg-[#FAFAFA] transition-all duration-700 flex flex-col h-full">
                {/* Image Frame - Sophisticated Padding/Borders */}
                <div className="relative aspect-[4/5] bg-[#F9F9F9] border border-[#EEEEEE] overflow-hidden mb-8 p-4 transition-all duration-700 group-hover:border-[#C79F68]/30">
                  <img 
                    src={`http://localhost:8000/${item.image_url}`} 
                    alt={item.title} 
                    loading="lazy"
                    className="w-full h-full object-cover filter saturate-[0.85] group-hover:saturate-[1.1] transition-all duration-1000 group-hover:scale-105" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/5 transition-all duration-700"></div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-serif text-[#1A1A1A] group-hover:text-[#C79F68] transition-colors duration-700">
                        {item.title}
                      </h3>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#BBB] mt-1">Exhibit #{item.id}</span>
                    </div>
                    
                    <p className="text-[11px] text-[#777] leading-relaxed italic font-medium tracking-wide">"{item.description}"</p>
                    
                    {item.category && (
                      <div className="pt-2">
                        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#C79F68] border-b border-[#C79F68]/30 pb-0.5">
                          {item.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-10 mt-auto">
                    <button className="flex-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border border-[#EEEEEE] py-4 hover:border-[#1A1A1A] transition-all duration-500">
                      Edit details
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#999] hover:text-red-700 transition-all duration-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
