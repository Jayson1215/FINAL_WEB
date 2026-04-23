import api from './api';

export const portfolioService = {
  getPortfolio: () => api.get('/client/Portfolio'),
  getPortfolioItem: id => api.get(`/client/Portfolio/${id}`),
  createPortfolioItem: data => api.post('/admin/portfolio', data),
  updatePortfolioItem: (id, data) => api.put(`/admin/portfolio/${id}`, data),
  deletePortfolioItem: id => api.delete(`/admin/portfolio/${id}`),
  getAllPortfolio: () => api.get('/admin/portfolio'),
};
