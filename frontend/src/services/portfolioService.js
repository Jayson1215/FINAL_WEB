import api from './api';

export const portfolioService = {
  // Client portfolio
  getPortfolio: () => api.get('/client/portfolio'),
  getPortfolioItem: (id) => api.get(`/client/portfolio/${id}`),

  // Admin portfolio
  createPortfolioItem: (data) => api.post('/admin/portfolio', data),
  updatePortfolioItem: (id, data) => api.put(`/admin/portfolio/${id}`, data),
  deletePortfolioItem: (id) => api.delete(`/admin/portfolio/${id}`),
  getAllPortfolio: () => api.get('/admin/portfolio'),
};
