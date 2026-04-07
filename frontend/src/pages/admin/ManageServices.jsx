import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { serviceService } from '../../services/serviceService';

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    image_path: '',
    downpayment_rate: 20,
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await serviceService.getAllServices();
      setServices(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load services');
      console.error(err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      duration: service.duration,
      image_path: service.image_path || '',
      downpayment_rate: service.downpayment_rate || 20,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        const currentEditId = editingServiceId;
        
        setShowForm(false);
        setEditingServiceId(null);
        setFormData({ name: '', description: '', category: '', price: '', duration: '', image_path: '', downpayment_rate: 20 });

        const response = await serviceService.updateService(currentEditId, formData);
        setServices(services => 
          services.map(s => s.id === currentEditId ? response.data : s)
        );
      } else {
        const response = await serviceService.createService(formData);
        setServices([...services, response.data]);
        setFormData({ name: '', description: '', category: '', price: '', duration: '', image_path: '', downpayment_rate: 20 });
        setShowForm(false);
      }
    } catch (err) {
      setShowForm(true);
      setError(editingServiceId ? 'Failed to update service' : 'Failed to create service');
      console.error(err);
      fetchServices();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const previousServices = [...services];
      setServices(services.filter(s => s.id !== id));
      await serviceService.deleteService(id);
    } catch (err) {
      setServices(previousServices);
      setError('Failed to delete service');
    }
  };

  if (loading && services.length === 0) {
    return (
      <AdminLayout title="Manage Services">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading services...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Studio Curations">
      {error && (
        <div className="mb-10 p-6 bg-red-50 border-l-2 border-red-200">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">Service Notice</p>
          <p className="text-sm text-red-800 font-serif italic">{error}</p>
        </div>
      )}

      <div className="space-y-16 animate-fadeIn">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#EEEEEE] pb-10 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-tight mb-4">Photography Services</h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C79F68]">Defining the art and value of your studio sessions.</p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingServiceId(null);
                setFormData({ name: '', description: '', category: '', price: '', duration: '', image_path: '' });
              } else {
                setShowForm(true);
              }
            }}
            className={`px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-sm active:scale-[0.98] ${
              showForm
                ? 'bg-white border border-[#EEEEEE] text-[#999] hover:text-red-600 hover:border-red-600'
                : 'bg-[#1A1A1A] text-white hover:bg-[#C79F68]'
            }`}
          >
            {showForm ? 'Cancel Creation' : 'Create New Service'}
          </button>
        </div>

        {/* Add Service Form - Minimalist & Precise */}
        {showForm && (
          <div className="bg-white border border-[#EEEEEE] p-10 md:p-12 animate-slideIn">
            <h3 className="text-2xl font-serif text-[#1A1A1A] mb-10">{editingServiceId ? 'Edit Collection' : 'New Collection Details'}</h3>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Service Nomenclature</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., The Signature Portrait"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-b border-[#EEEEEE] py-4 text-sm focus:border-[#C79F68] outline-none transition-all duration-500 placeholder:text-[#DDD]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Artistic Description</label>
                <textarea
                  name="description"
                  placeholder="Describe the aesthetic and deliverables..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-transparent border-b border-[#EEEEEE] py-4 text-sm focus:border-[#C79F68] outline-none transition-all duration-500 placeholder:text-[#DDD] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Investment (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent border-b border-[#EEEEEE] py-4 text-sm focus:border-[#C79F68] outline-none transition-all duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Downpayment Rate (%)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    name="downpayment_rate"
                    placeholder="20"
                    value={formData.downpayment_rate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent border-b border-[#EEEEEE] py-4 text-sm focus:border-[#C79F68] outline-none transition-all duration-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Session Duration (min)</label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="60"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent border-b border-[#EEEEEE] py-4 text-sm focus:border-[#C79F68] outline-none transition-all duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Curated Category</label>
                  <input
                    type="text"
                    name="category"
                    placeholder="Portraits, Wedding, Editorial..."
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[#EEEEEE] py-4 text-sm focus:border-[#C79F68] outline-none transition-all duration-500 placeholder:text-[#DDD]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Image Registry URL</label>
                <input
                  type="text"
                  name="image_path"
                  placeholder="assets/images/service_wedding.png"
                  value={formData.image_path}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-b border-[#EEEEEE] py-4 text-sm focus:border-[#C79F68] outline-none transition-all duration-500 placeholder:text-[#DDD]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] text-white py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#C79F68] transition-all duration-700 shadow-sm"
              >
                {editingServiceId ? 'Update Collection' : 'Publish Service'}
              </button>
            </form>
          </div>
        )}

        {/* Services Grid - Gallery Layout */}
        {services.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[#EEEEEE]">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#BBB]">Your studio catalog is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-[#EEEEEE] divide-y md:divide-y-0 md:divide-x divide-[#EEEEEE]">
            {services.map(service => (
              <div key={service.id} className="bg-white p-10 group hover:bg-[#FAFAFA] transition-all duration-700 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#C79F68] border border-[#C79F68]/20 px-3 py-1">
                      {service.category || 'Standard'}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#AAA]">
                      {service.duration} MIN
                    </span>
                  </div>
                  
                  {/* Service Image Preview */}
                  <div className="w-full aspect-[16/9] mb-8 bg-[#F9F9F9] overflow-hidden border border-[#EEEEEE] relative group/img">
                    {service.image_path ? (
                      <img 
                        src={`http://localhost:8000/${service.image_path}`} 
                        alt={service.name}
                        className="w-full h-full object-cover grayscale opacity-80 group-hover/img:grayscale-0 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-1000"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20 grayscale">
                        <span className="text-2xl">📸</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-2xl font-serif text-[#1A1A1A] mb-4 group-hover:text-[#C79F68] transition-colors duration-700">{service.name}</h4>
                  <p className="text-[11px] text-[#777] leading-relaxed mb-10 line-clamp-3 font-medium tracking-wide italic">"{service.description}"</p>
                </div>
                
                <div className="space-y-10">
                  <div className="flex items-end justify-between border-t border-[#F5F5F5] pt-10">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#BBB] mb-2">Investment / Deposit</p>
                      <p className="text-2xl font-serif text-[#1A1A1A]">₱{parseFloat(service.price).toLocaleString()}</p>
                      <p className="text-[10px] text-[#C79F68] font-bold mt-1 uppercase tracking-widest">{service.downpayment_rate}% Downpayment Required</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleEdit(service)}
                      className="flex-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A] border border-[#EEEEEE] py-4 hover:border-[#1A1A1A] transition-all duration-500">
                      Revise
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="flex-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#999] hover:text-red-600 transition-all duration-500"
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
