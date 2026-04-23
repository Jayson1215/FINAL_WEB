import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { serviceService } from '../../services/serviceService';
import { portfolioService } from '../../services/portfolioService';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function ManageServices() {
  const [d, setD] = useState({ s: [], p: [], loading: true, form: false });
  const [f, setF] = useState({ name: '', description: '', category: '', price: '', duration: '', image_path: '' });
  const [editId, setEditId] = useState(null);

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

  const del = async (id) => {
    if (window.confirm('Delete?')) {
      await serviceService.deleteService(id);
      setD(p => ({ ...p, s: p.s.filter(x => x.id !== id) }));
    }
  };

  if (d.loading) return <AdminLayout title="..."><div className="h-96 flex items-center justify-center animate-pulse">Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Packages">
      <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold">Collections</h2>
          <button onClick={() => setD({ ...d, form: !d.form })} className="bg-[#1E293B] text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase">{d.form ? 'Cancel' : '+ New Package'}</button>
        </div>

        {d.form && (
          <form onSubmit={save} className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-4">
            <input placeholder="Name" className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Price" type="number" className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} required />
              <input placeholder="Duration (min)" type="number" className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={f.duration} onChange={e => setF({ ...f, duration: e.target.value })} required />
            </div>
            <textarea placeholder="Description" className="w-full bg-gray-50 p-4 rounded-xl text-xs h-24" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
            <button className="w-full bg-[#E8734A] text-white py-4 rounded-xl text-[10px] font-bold uppercase">{editId ? 'Update' : 'Create'}</button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {d.s.map(s => (
            <div key={s.id} className="bg-white rounded-[2rem] p-4 border group">
              <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-50">
                <img src={resolveImageUrl(s.image_path)} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold">{s.name}</h4>
              <p className="text-xl font-bold text-[#E8734A] mt-2">₱{parseFloat(s.price).toLocaleString()}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setF(s); setEditId(s.id); setD({ ...d, form: true }); }} className="flex-1 py-2 bg-gray-50 rounded-lg text-[9px] font-bold uppercase">Edit</button>
                <button onClick={() => del(s.id)} className="flex-1 py-2 text-red-500 text-[9px] font-bold uppercase">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
