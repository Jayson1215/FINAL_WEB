import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { portfolioService } from '../../services/portfolioService';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function ManagePortfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title:'', description:'', category:'', image:null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchPortfolio(); }, []);
  const fetchPortfolio = async () => { try { setLoading(true); const r = await portfolioService.getPortfolio(); setPortfolio(r.data); } catch(e){ setError('Failed to load portfolio'); } finally { setLoading(false); } };
  const handleSubmit = async (e) => { e.preventDefault(); try { const fd = new FormData(); fd.append('title',formData.title); fd.append('description',formData.description); fd.append('category',formData.category); if(formData.image) fd.append('image',formData.image); await portfolioService.createPortfolio(fd); setFormData({title:'',description:'',category:'',image:null}); setShowForm(false); fetchPortfolio(); } catch(e){ setError('Failed to upload'); } };
  const handleDelete = async (id) => { if(!window.confirm('Delete this item?')) return; try { await portfolioService.deletePortfolio(id); setPortfolio(portfolio.filter(p=>p.id!==id)); } catch(e){ setError('Failed to delete'); } };

  if(loading) return (<AdminLayout title="Manage Portfolio"><div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto"></div></div></AdminLayout>);

  return (
    <AdminLayout title="Portfolio Gallery">
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div><h2 className="text-2xl font-bold text-[#1E293B] mb-1">Portfolio Gallery</h2><p className="text-sm text-[#94A3B8]">Showcase your best work to clients.</p></div>
          <button onClick={()=>setShowForm(!showForm)} className={`px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${showForm?'bg-[#F0F2F5] text-[#64748B] border border-[#E2E8F0]':'bg-gradient-to-r from-[#E8734A] to-[#FB923C] text-white shadow-md'}`}>
            {showForm?'Cancel':'+ Add Work'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-card border border-[#F1F5F9] p-8 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6">Upload New Work</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Title</label><input type="text" value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition" /></div>
              <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Description</label><textarea value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} rows={3} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition resize-none" /></div>
              <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Category</label><input type="text" value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition" /></div>
              <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Image File</label><input type="file" accept="image/*" onChange={e=>setFormData({...formData,image:e.target.files[0]})} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E8734A] file:text-white" /></div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#E8734A] to-[#FB923C] text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-lg transition">Upload to Gallery</button>
            </form>
          </div>
        )}

        {portfolio.length===0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-[#E2E8F0]"><p className="text-sm text-[#94A3B8]">Gallery is empty. Upload your first piece!</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-[#F1F5F9] overflow-hidden group transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden bg-[#F8F9FB] relative">
                  <img src={resolveImageUrl(item.image_url)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>{e.target.style.display='none';}} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider text-white bg-[#1E293B]/70 backdrop-blur px-2.5 py-1 rounded-lg">{item.category||'General'}</span>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-[#1E293B] mb-1 group-hover:text-[#E8734A] transition-colors">{item.title}</h4>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-4">{item.description}</p>
                  <button onClick={()=>handleDelete(item.id)} className="text-[10px] font-semibold text-[#94A3B8] hover:text-red-500 transition uppercase tracking-wider">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
