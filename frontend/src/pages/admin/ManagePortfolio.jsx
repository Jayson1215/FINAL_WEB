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
    <AdminLayout title="Manage Portfolio">
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

      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest">Gallery Management</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Portfolio Showcase</h2>
        </div>

        {/* Portfolio Grid */}
        {portfolio.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <span className="text-5xl mb-4 block">🖼️</span>
            <p className="text-slate-600 text-lg font-medium">No portfolio items yet</p>
            <p className="text-slate-500 text-sm mt-2">Add your best work to showcase your photography</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="relative overflow-hidden h-56 bg-gradient-to-br from-slate-200 to-slate-300">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {item.title}
                    </h3>
                    <span className="text-xl">📸</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.description}</p>
                  {item.category && (
                    <div className="mb-6">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition uppercase">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-semibold transition uppercase"
                    >
                      Delete
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
