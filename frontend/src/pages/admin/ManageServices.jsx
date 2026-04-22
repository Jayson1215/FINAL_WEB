import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { serviceService } from '../../services/serviceService';
import { portfolioService } from '../../services/portfolioService';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPortfolioPicker, setShowPortfolioPicker] = useState(false);
  const [formData, setFormData] = useState({ name:'', description:'', inclusions:'', category:'', price:'', duration:'', image_path:'', downpayment_rate:20 });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { 
    fetchServices();
    fetchPortfolio();
  }, []);

  const fetchServices = async () => { 
    try { 
      setLoading(true); 
      setError(''); 
      const r = await serviceService.getAllServices(); 
      setServices(r.data); 
    } catch(e){ 
      setError('Failed to load packages'); 
      setServices([]); 
    } finally { 
      setLoading(false); 
    } 
  };

  const fetchPortfolio = async () => {
    try {
      const r = await portfolioService.getAllPortfolio();
      setPortfolio(r.data);
    } catch(e) {
      console.error('Failed to load portfolio items');
    }
  };

  const handleEdit = (s) => { 
    setEditingServiceId(s.id); 
    setFormData({
      name:s.name,
      description:s.description,
      inclusions:s.inclusions||'',
      category:s.category,
      price:s.price,
      duration:s.duration,
      image_path:s.image_path||'',
      downpayment_rate:s.downpayment_rate||20
    }); 
    setShowForm(true); 
    window.scrollTo({top:0,behavior:'smooth'}); 
  };

  const handleInputChange = (e) => { 
    const {name,value}=e.target; 
    setFormData(p=>({...p,[name]:value})); 
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    try { 
      if(editingServiceId){ 
        const id=editingServiceId; 
        const r=await serviceService.updateService(id,formData); 
        setServices(s=>s.map(x=>x.id===id?r.data:x)); 
        setEditingServiceId(null);
      } else { 
        const r=await serviceService.createService(formData); 
        setServices([...services,r.data]); 
      } 
      setFormData({name:'',description:'',inclusions:'',category:'',price:'',duration:'',image_path:'',downpayment_rate:20}); 
      setShowForm(false); 
    } catch(e){ 
      setError('Failed to save package'); 
    } 
  };

  const handleDelete = async (id) => { 
    if(!window.confirm('Delete this package?')) return; 
    try { 
      await serviceService.deleteService(id);
      setServices(services.filter(s=>s.id!==id)); 
    } catch(e){ 
      setError('Failed to delete'); 
    } 
  };

  const selectFromPortfolio = (item) => {
    setFormData({
      ...formData,
      name: item.title,
      description: item.description || '',
      category: item.category || '',
      image_path: item.image_url || ''
    });
    setShowPortfolioPicker(false);
    setShowForm(true);
  };

  if (loading && services.length===0) return (<AdminLayout title="Manage Packages"><div className="flex justify-center items-center h-96"><div className="text-center"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto mb-4"></div><p className="text-[#64748B]">Loading packages...</p></div></div></AdminLayout>);

  return (
    <AdminLayout title="Photography Packages">
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      
      <div className="space-y-8 animate-fadeIn">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-1">On-Call Packages</h2>
            <p className="text-sm text-[#94A3B8]">Define your on-call photography offerings and pricing.</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={() => setShowPortfolioPicker(true)}
              className="px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-white text-[#1E293B] border border-[#E2E8F0] shadow-sm hover:bg-[#F8F9FB] transition-all"
            >
              From Portfolio
            </button>
            <button 
              onClick={() => { 
                if(showForm){
                  setShowForm(false);
                  setEditingServiceId(null);
                  setFormData({name:'',description:'',inclusions:'',category:'',price:'',duration:'',image_path:'',downpayment_rate:20});
                }else{
                  setShowForm(true);
                } 
              }}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${showForm?'bg-[#F0F2F5] text-[#64748B] hover:text-red-500 border border-[#E2E8F0]':'bg-gradient-to-r from-[#E8734A] to-[#FB923C] text-white shadow-md hover:shadow-lg'}`}
            >
              {showForm ? 'Cancel' : '+ Create New'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-card border border-[#F1F5F9] p-8 animate-fadeIn">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6">{editingServiceId?'Edit Package':'New Package'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Package Name</label><input type="text" name="name" placeholder="e.g., Signature Portrait" value={formData.name} onChange={handleInputChange} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] focus:ring-2 focus:ring-[#E8734A]/10 outline-none transition" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Description</label><textarea name="description" placeholder="Describe the package..." value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition resize-none" /></div>
                <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Inclusions</label><textarea name="inclusions" placeholder="What is included (e.g., 20 edited photos, 1 hour session)..." value={formData.inclusions} onChange={handleInputChange} rows={4} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition resize-none" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Price (₱)</label><input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition" /></div>
                <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Downpayment (%)</label><input type="number" name="downpayment_rate" value={formData.downpayment_rate} onChange={handleInputChange} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Duration (min)</label><input type="number" name="duration" value={formData.duration} onChange={handleInputChange} required className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition" /></div>
                <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Category</label><input type="text" name="category" placeholder="Portraits, Wedding..." value={formData.category} onChange={handleInputChange} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition" /></div>
              </div>
              <div><label className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-1.5">Image Path</label><input type="text" name="image_path" placeholder="assets/images/service.png" value={formData.image_path} onChange={handleInputChange} className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:border-[#E8734A] outline-none transition" /></div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#E8734A] to-[#FB923C] text-white py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl hover:shadow-lg transition">{editingServiceId?'Update Package':'Publish Package'}</button>
            </form>
          </div>
        )}

        {/* Portfolio Picker Modal */}
        {showPortfolioPicker && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-slideUp">
              <div className="p-6 border-b border-[#F1F5F9] flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-[#1E293B]">Select from Portfolio</h3>
                  <p className="text-xs text-[#94A3B8]">Choose a masterpiece to convert into a package.</p>
                </div>
                <button onClick={() => setShowPortfolioPicker(false)} className="text-[#94A3B8] hover:text-[#1E293B] transition">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {portfolio.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-sm text-[#94A3B8]">No portfolio items found.</p>
                    </div>
                  ) : (
                    portfolio.map(item => (
                      <div key={item.id} className="group cursor-pointer bg-[#F8F9FB] rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#E8734A] transition-all" onClick={() => selectFromPortfolio(item)}>
                        <div className="aspect-square relative overflow-hidden">
                          <img src={resolveImageUrl(item.image_url)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.style.display='none';}} />
                        </div>
                        <div className="p-4">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#E8734A] mb-1">{item.category || 'Series'}</p>
                          <h4 className="text-sm font-bold text-[#1E293B] truncate">{item.title}</h4>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-[#F1F5F9] bg-[#F8F9FB] flex justify-end">
                <button onClick={() => setShowPortfolioPicker(false)} className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#64748B] hover:text-[#1E293B] transition">Close</button>
              </div>
            </div>
          </div>
        )}

        {services.length===0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-[#E2E8F0]"><p className="text-sm text-[#94A3B8]">No packages yet. Create your first one!</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(s => (
              <div key={s.id} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-[#F1F5F9] hover:border-[#E8734A]/20 transition-all duration-300 flex flex-col overflow-hidden group">
                <div className="w-full aspect-[16/9] bg-[#F8F9FB] overflow-hidden relative">
                  {s.image_path ? (<img src={resolveImageUrl(s.image_path)} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e)=>{e.target.style.display='none';}} />) : (<div className="w-full h-full flex items-center justify-center text-[#E2E8F0]"><span className="text-4xl">📸</span></div>)}
                  <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#E8734A] to-[#FB923C] px-3 py-1 rounded-lg shadow">{s.category||'General'}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="text-lg font-bold text-[#1E293B] mb-2 group-hover:text-[#E8734A] transition-colors">{s.name}</h4>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-4 line-clamp-2 flex-1">{s.description}</p>
                  {s.inclusions && (
                    <div className="mb-4 bg-[#F8F9FB] p-3 rounded-lg border border-[#F1F5F9]">
                       <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">Inclusions</p>
                       <p className="text-[10px] text-[#1E293B] font-medium line-clamp-2">{s.inclusions}</p>
                    </div>
                  )}
                  <div className="flex items-end justify-between pt-4 border-t border-[#F1F5F9]">
                    <div><p className="text-2xl font-bold text-[#1E293B]">₱{parseFloat(s.price).toLocaleString()}</p><p className="text-[10px] text-[#E8734A] font-semibold">{s.downpayment_rate}% deposit</p></div>
                    <span className="text-[10px] font-semibold text-[#94A3B8] bg-[#F8F9FB] px-2.5 py-1 rounded-lg">{s.duration} min</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={()=>handleEdit(s)} className="flex-1 text-xs font-semibold text-[#1E293B] bg-[#F0F2F5] py-2.5 rounded-xl hover:bg-[#E2E8F0] transition">Edit</button>
                    <button onClick={()=>handleDelete(s.id)} className="flex-1 text-xs font-semibold text-[#94A3B8] hover:text-red-500 py-2.5 transition">Remove</button>
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
