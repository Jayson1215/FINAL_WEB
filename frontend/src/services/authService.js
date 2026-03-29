import api from './api';

export const authService = {
  register: (data) => api.post('/register', data),
  login: (email, password) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  getProfile: () => api.get('/profile'),
};
