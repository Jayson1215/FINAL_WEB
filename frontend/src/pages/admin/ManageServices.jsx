import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { serviceService } from '../../services/serviceService';
import { portfolioService } from '../../services/portfolioService';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function ManageServices() {
  const [d, setD] = useState({ s: [], p: [], loading: true, form: false });
  const [f, setF] = useState({ name: '', description: '', category: '', price: '', duration: '', image_path: '' });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const formatDur = (m) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}:${mm.toString().padStart(2, '0')} hours`;
  };

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([serviceService.getAllServices(), portfolioService.getAllPortfolio()]);
        setD({ s: s.data || [], p: p.data || [], loading: false, form: false });
      } catch (e) { setD(p => ({ ...p, loading: false })); }
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const res = editId ? await serviceService.updateService(editId, f) : await serviceService.createService(f);
      setD(p => ({ ...p, s: editId ? p.s.map(x => x.id === editId ? res.data : x) : [...p.s, res.data], form: false }));
      setF({ name: '', description: '', category: '', price: '', duration: '', image_path: '' });
      setEditId(null);
    } catch (e) { alert('Save Failed'); }
  };

  const del = async () => {
    if (!deleteId) return;
    try {
      await serviceService.deleteService(deleteId);
      setD(p => ({ ...p, s: p.s.filter(x => x.id !== deleteId) }));
      setDeleteId(null);
    } catch (e) { alert('Delete Failed'); }
  };

  if (d.loading) return <AdminLayout title="..."><div className="h-96 flex items-center justify-center animate-pulse">Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Packages">
      <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold text-[#1E293B]">Collections</h2>
          <button onClick={() => setD({ ...d, form: !d.form })} className="bg-[#1E293B] text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase">{d.form ? 'Cancel' : '+ New Package'}</button>
        </div>

        {d.form && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-3xl z-[500] flex items-center justify-center p-6 animate-fadeIn overflow-y-auto" onClick={() => { setD({ ...d, form: false }); setEditId(null); setF({ name: '', description: '', category: '', price: '', duration: '', image_path: '' }); }}>
            <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] max-w-xl w-full relative shadow-2xl border border-white/50 p-12 animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="mb-10 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-4">Service Management</p>
                <h3 className="text-3xl font-serif text-[#1E293B]">{editId ? 'Refine Package' : 'New Collection'}</h3>
                <p className="text-[10px] font-bold text-[#1E293B]/60 uppercase tracking-widest mt-2">Adjust details for your visual services</p>
              </div>
              <form onSubmit={save} className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Package Name</p>
                  <input placeholder="Ex: Premium Portrait Session" className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold focus:bg-white focus:border-[#E8734A] transition-all outline-none" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Base Price (₱)</p>
                    <input placeholder="0.00" type="number" className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold focus:bg-white focus:border-[#E8734A] transition-all outline-none" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Duration (Hours)</p>
                    <input placeholder="Ex: 1.5" type="number" step="0.1" className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold focus:bg-white focus:border-[#E8734A] transition-all outline-none" value={f.duration / 60 || ''} onChange={e => setF({ ...f, duration: parseFloat(e.target.value) * 60 })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Service Description</p>
                  <textarea placeholder="Describe the package details..." className="w-full bg-white/60 p-4 rounded-2xl text-xs h-32 border border-gray-400 text-[#1E293B] font-medium focus:border-[#E8734A] transition-all outline-none" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
                </div>
                <button className="w-full bg-[#1E293B] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-xl mt-2">{editId ? 'Save Changes' : 'Launch Collection'}</button>
              </form>
              <button onClick={() => { setD({ ...d, form: false }); setEditId(null); }} className="absolute top-8 right-8 text-2xl text-[#1E293B]/40 hover:text-[#1E293B] transition-colors">×</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {d.s.map(s => (
            <div key={s.id} className="bg-white rounded-[2.5rem] p-5 border border-gray-200 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="aspect-[4/3] rounded-[1.8rem] overflow-hidden mb-6 bg-gray-100 border border-gray-100">
                <img src={resolveImageUrl(s.image_path)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.name} />
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="text-xl font-serif text-[#1E293B] leading-tight">{s.name}</h4>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-[#1E293B]">₱{parseFloat(s.price).toLocaleString()}</p>
                  <p className="text-[9px] text-[#1E293B]/40 font-bold uppercase tracking-widest">— {formatDur(s.duration)}</p>
                </div>
                <p className="text-xs text-[#1E293B]/70 leading-relaxed line-clamp-3 italic">"{s.description || 'No description provided.'}"</p>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => { setF(s); setEditId(s.id); setD({ ...d, form: true }); }} className="flex-1 py-3.5 bg-[#1E293B] text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-md">Edit Package</button>
                <button onClick={() => setDeleteId(s.id)} className="flex-1 py-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {deleteId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[600] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setDeleteId(null)}>
            <div className="bg-white rounded-[2.5rem] max-w-sm w-full relative shadow-2xl border border-gray-200 p-10 text-center animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-2xl font-serif text-[#1E293B] mb-2">Confirm Deletion</h3>
              <p className="text-[10px] text-[#1E293B]/60 font-bold uppercase tracking-[0.2em] mb-8">This action cannot be undone</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-[#1E293B] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">Cancel</button>
                <button onClick={del} className="flex-1 py-4 bg-red-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">Confirm Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
