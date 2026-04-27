import api from './api';

export const serviceService = {
  getServices: () => api.get(`/client/Packages?t=${Date.now()}`),
  getServiceDetail: id => api.get(`/client/Packages/${id}?t=${Date.now()}`),
  createService: data => api.post('/admin/services', data),
  updateService: (id, data) => {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      data.append('_method', 'PUT');
      return api.post(`/admin/services/${id}`, data);
    }
    return api.put(`/admin/services/${id}`, data);
  },
  deleteService: id => api.delete(`/admin/services/${id}`),
  getAllServices: () => api.get(`/admin/services?t=${Date.now()}`),
};
