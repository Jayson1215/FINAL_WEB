import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { serviceService } from '../../services/serviceService';
import { portfolioService } from '../../services/portfolioService';
import { bookingService } from '../../services/bookingService';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function ManageServices() {
  const [d, setD] = useState({ s: [], p: [], a: [], loading: true, form: false, cat: 'All' });
  const [f, setF] = useState({ name: '', description: '', category: 'Wedding', price: '', duration: '', image_path: '', inclusions: '' });
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
        const [sRes, pRes, aRes] = await Promise.allSettled([
          serviceService.getAllServices(), 
          portfolioService.getAllPortfolio(),
          bookingService.getAddOns()
        ]);
        
        setD(prev => ({ 
          ...prev, 
          s: sRes.status === 'fulfilled' ? (sRes.value.data || []) : [], 
          p: pRes.status === 'fulfilled' ? (pRes.value.data || []) : [], 
          a: aRes.status === 'fulfilled' ? (aRes.value.data || []) : [], 
          loading: false, 
          form: false 
        }));

        if (sRes.status === 'rejected') console.error('Services fetch failed:', sRes.reason);
        if (aRes.status === 'rejected') console.error('Addons fetch failed:', aRes.reason);
      } catch (e) { 
        console.error('Fatal fetch error:', e);
        setD(p => ({ ...p, loading: false })); 
      }
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const res = editId ? await serviceService.updateService(editId, f) : await serviceService.createService(f);
      setD(p => ({ ...p, s: editId ? p.s.map(x => x.id === editId ? res.data : x) : [...p.s, res.data], form: false }));
      setF({ name: '', description: '', category: '', price: '', duration: '', image_path: '', inclusions: '' });
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
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[500] flex items-center justify-center p-6 animate-fadeIn overflow-y-auto" onClick={() => { setD({ ...d, form: false }); setEditId(null); setF({ name: '', description: '', category: '', price: '', duration: '', image_path: '', inclusions: '' }); }}>
            <div className="bg-white rounded-[4rem] max-w-4xl w-full relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-12 animate-cinemaShow border border-white/20" onClick={e => e.stopPropagation()}>
              <div className="mb-10 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A] mb-4">Package Management</p>
                <h3 className="text-5xl font-serif text-black leading-tight tracking-tighter">{editId ? 'Refine Package' : 'New Collection'}</h3>
                <p className="text-[10px] font-bold text-black uppercase tracking-widest mt-2">Adjust details for your visual packages</p>
              </div>
              <form onSubmit={save} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Package Name</p>
                    <input placeholder="Ex: Premium Portrait" className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold focus:bg-white focus:border-[#E8734A] transition-all outline-none" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Category</p>
                    <select className="w-full bg-white/60 p-4 rounded-2xl text-xs border border-gray-400 text-[#1E293B] font-bold focus:bg-white focus:border-[#E8734A] transition-all outline-none" value={f.category} onChange={e => setF({ ...f, category: e.target.value })} required>
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Christening">Christening</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Commercial">Commercial</option>
                      <option value="General Event">General Event</option>
                    </select>
                  </div>
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
                  <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Package Description</p>
                  <textarea placeholder="Describe the package details..." className="w-full bg-white/60 p-4 rounded-2xl text-xs h-24 border border-gray-400 text-[#1E293B] font-medium focus:border-[#E8734A] transition-all outline-none" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <p className="text-[8px] font-bold text-[#1E293B]/80 uppercase tracking-widest pl-2">Package Inclusions (One per line)</p>
                  <textarea placeholder="• Item 1&#10;• Item 2..." className="w-full bg-white/60 p-4 rounded-2xl text-xs h-32 border border-gray-400 text-black font-medium focus:border-[#E8734A] transition-all outline-none" value={f.inclusions} onChange={e => setF({ ...f, inclusions: e.target.value })} />
                </div>
                <button className="w-full bg-black text-white py-6 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-2xl mt-4">{editId ? 'Save Changes' : 'Launch Collection'}</button>
              </form>
              <button onClick={() => { setD({ ...d, form: false }); setEditId(null); }} className="absolute top-10 right-10 text-3xl text-black/20 hover:text-black transition-colors font-serif">×</button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {['All', ...new Set(d.s.map(s => s.category))].filter(Boolean).map(cat => (
            <button key={cat} onClick={() => setD(p => ({ ...p, cat }))} className={`px-5 py-2 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${d.cat === cat ? 'bg-black text-white shadow-lg' : 'bg-white text-black border-2 border-black hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {d.s.filter(s => d.cat === 'All' || s.category === d.cat).length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-black">No {d.cat} packages configured.</p>
            </div>
          ) : (
            d.s.filter(s => d.cat === 'All' || s.category === d.cat).map(s => (
              <div key={s.id} className="bg-white rounded-[2.5rem] p-5 border-2 border-black shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="aspect-[4/3] rounded-[1.8rem] overflow-hidden mb-6 bg-gray-100 border-2 border-black relative">
                  <img src={resolveImageUrl(s.image_path)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.name} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest text-black shadow-sm border border-black">{s.category}</div>
                </div>
                <div className="space-y-3 flex-1">
                  <h4 className="text-xl font-serif text-black leading-tight">{s.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-black tracking-tight">₱{parseFloat(s.price).toLocaleString()}</p>
                    <p className="text-[9px] text-black font-bold uppercase tracking-widest">— {formatDur(s.duration)}</p>
                  </div>
                  <p className="text-xs text-black leading-relaxed line-clamp-2 italic">"{s.description || 'No description provided.'}"</p>
                  <div className="space-y-1.5 pt-3 border-t-2 border-black">
                    <p className="text-[7px] font-bold text-[#E8734A] uppercase tracking-widest">Inclusions Highlight:</p>
                    <div className="space-y-1">
                      {s.inclusions?.split('\n').slice(0, 2).map((inc, i) => (
                        <p key={i} className="text-[9px] text-black font-medium truncate">• {inc.replace('• ', '')}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => { setF(s); setEditId(s.id); setD({ ...d, form: true }); }} className="flex-1 py-3.5 bg-[#1E293B] text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-[#E8734A] transition-all shadow-md">Edit Package</button>
                  <button onClick={() => setDeleteId(s.id)} className="flex-1 py-3.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Global Add-ons Section */}
        <div className="mt-20 space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-black/10"></div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-black">Global Enhancement Add-ons</h3>
                <div className="h-[1px] flex-1 bg-black/10"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {d.a.map(addon => (
                    <div key={addon.id} className="bg-white p-6 rounded-[2rem] border border-black/10 shadow-sm flex flex-col items-center text-center space-y-2 hover:border-black transition-all">
                        <p className="text-[11px] font-bold text-black tracking-tight">{addon.name}</p>
                        <p className="text-[10px] font-black text-[#E8734A]">₱{parseFloat(addon.price).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>

        {deleteId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[600] flex items-center justify-center p-6 animate-fadeIn" onClick={() => setDeleteId(null)}>
            <div className="bg-white rounded-[2.5rem] max-w-sm w-full relative shadow-2xl border border-gray-200 p-10 text-center animate-slideUp" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-2xl font-serif text-[#1E293B] mb-2">Confirm Deletion</h3>
              <p className="text-[10px] text-black font-bold uppercase tracking-[0.2em] mb-8">This action cannot be undone</p>
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
