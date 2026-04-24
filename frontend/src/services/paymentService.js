import api from './api';

export const paymentService = {
  createCheckoutSession: (data) => api.post('/client/payments/create-session', data),
  verifyPayment: (sessionId) => api.post('/client/payments/verify', { session_id: sessionId }),
  manualPayment: (data) => api.post('/client/payments', data),
  getAdminPayments: () => api.get('/admin/payments'),
  confirmPayment: (id) => api.post(`/admin/payments/${id}/confirm`),
  getReports: () => api.get('/admin/reports'),
};
