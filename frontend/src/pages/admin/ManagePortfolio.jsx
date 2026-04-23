import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { portfolioService } from '../../services/portfolioService';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function ManagePortfolio() {
  const [d, setD] = useState({ list: [], loading: true, form: false });
  const [f, setF] = useState({ title: '', description: '', category: '', image: null });

  useEffect(() => { fetch(); }, []);
  const fetch = async () => { try { const r = await portfolioService.getPortfolio(); setD({ list: r.data, loading: false, form: false }); } catch(e) { setD(p => ({ ...p, loading: false })); } };

  const save = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(f).forEach(k => fd.append(k, f[k]));
      await portfolioService.createPortfolio(fd);
      setF({ title: '', description: '', category: '', image: null });
      fetch();
    } catch(e) { alert('Upload Failed'); }
  };

  const del = async (id) => { if (window.confirm('Delete?')) { await portfolioService.deletePortfolio(id); fetch(); } };

  if (d.loading) return <AdminLayout title="..."><div className="h-96 flex items-center justify-center animate-pulse">Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Portfolio">
      <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold">Gallery</h2>
          <button onClick={() => setD({ ...d, form: !d.form })} className="bg-[#1E293B] text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase">{d.form ? 'Cancel' : '+ Add Work'}</button>
        </div>

        {d.form && (
          <form onSubmit={save} className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-4">
            <input placeholder="Title" className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} required />
            <input placeholder="Category" className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={f.category} onChange={e => setF({ ...f, category: e.target.value })} />
            <input type="file" className="text-xs" onChange={e => setF({ ...f, image: e.target.files[0] })} required />
            <button className="w-full bg-[#E8734A] text-white py-4 rounded-xl text-[10px] font-bold uppercase">Upload</button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {d.list.map(p => (
            <div key={p.id} className="bg-white rounded-[2rem] overflow-hidden border group">
              <div className="aspect-square bg-gray-50">
                <img src={resolveImageUrl(p.image_url)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="p-6 flex justify-between items-center">
                <div><h4 className="font-bold text-sm">{p.title}</h4><p className="text-[9px] text-gray-400 uppercase">{p.category}</p></div>
                <button onClick={() => del(p.id)} className="text-red-500 text-[9px] font-bold uppercase">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
