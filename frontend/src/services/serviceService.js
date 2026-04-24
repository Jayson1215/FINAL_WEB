import api from './api';

export const serviceService = {
  getServices: () => api.get(`/client/Packages?t=${Date.now()}`),
  getServiceDetail: id => api.get(`/client/Packages/${id}?t=${Date.now()}`),
  createService: data => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: id => api.delete(`/admin/services/${id}`),
  getAllServices: () => api.get(`/admin/services?t=${Date.now()}`),
};
