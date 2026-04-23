import api from './api';

export const portfolioService = {
  // Client portfolio
  getPortfolio: () => api.get('/client/Portfolio'),
  getPortfolioItem: (id) => api.get(`/client/Portfolio/${id}`),

  // Admin portfolio
  createPortfolioItem: (data) => api.post('/admin/portfolio', data),
  updatePortfolioItem: (id, data) => api.put(`/admin/portfolio/${id}`, data),
  deletePortfolioItem: (id) => api.delete(`/admin/portfolio/${id}`),
  getAllPortfolio: () => api.get('/admin/portfolio'),
};
