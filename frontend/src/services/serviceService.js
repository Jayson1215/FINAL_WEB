import api from './api';

export const serviceService = {
  // Client services
  getServices: () => api.get('/client/services'),
  getServiceDetail: (id) => api.get(`/client/services/${id}`),

  // Admin services
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  getAllServices: () => api.get('/admin/services'),
};
