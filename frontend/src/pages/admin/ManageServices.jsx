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
        setServices(services.map(s => s.id === editingServiceId ? { ...s, ...formData } : s));
        const currentEditId = editingServiceId;
        
        setShowForm(false);
        setEditingServiceId(null);
        setFormData({ name: '', description: '', category: '', price: '', duration: '' });

        const response = await serviceService.updateService(currentEditId, formData);
        setServices(services => 
          services.map(s => s.id === currentEditId ? response.data : s)
        );
      } else {
        const newService = { id: Date.now(), ...formData };
        setServices([...services, newService]);
        setFormData({ name: '', description: '', category: '', price: '', duration: '' });
        setShowForm(false);
        
        const response = await serviceService.createService(formData);
        setServices(services => 
          services.map(s => s.id === newService.id ? response.data : s)
        );
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
      const previousServices = services;
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
    <AdminLayout title="Manage Services">
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
        {/* Header with Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-widest">Studio Management</p>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Photography Services</h2>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingServiceId(null);
                setFormData({ name: '', description: '', category: '', price: '', duration: '' });
              } else {
                setShowForm(true);
              }
            }}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
              showForm
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20'
            }`}
          >
            {showForm ? '✕ Cancel' : '+ Add Service'}
          </button>
        </div>

        {/* Add Service Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{editingServiceId ? 'Edit Service' : 'Create New Service'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Service Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Premium Portrait Session"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe what's included in this service..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="60"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g., Portraits, Events, Weddings"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                {editingServiceId ? 'Update Service' : 'Create Service'}
              </button>
            </form>
          </div>
        )}

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <span className="text-5xl mb-4 block">📸</span>
            <p className="text-slate-600 text-lg font-medium">No services yet</p>
            <p className="text-slate-500 text-sm mt-2">Create your first photography service to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold mb-3">
                      {service.category || 'Photography'}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">{service.name}</h4>
                  </div>
                  <span className="text-2xl">📷</span>
                </div>
                
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">{service.description}</p>
                
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">Price</p>
                    <p className="text-3xl font-bold text-amber-600">₱{parseFloat(service.price).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">Duration</p>
                    <p className="text-lg font-bold text-slate-900">{service.duration} min</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleEdit(service)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
