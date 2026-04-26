import api from './api';

export const paymentService = {
  createCheckoutSession: (data) => api.post('/client/payments/create-session', data),
  verifyPayment: (sessionId) => api.post('/payments/verify', { session_id: sessionId }),
  verifyPaymentByBooking: (bookingId) => api.post('/payments/verify', { booking_id: bookingId }),
  manualPayment: (data) => api.post('/client/payments', data),
  getAllPayments: () => api.get('/admin/payments'),
  getAdminPayments: () => api.get('/admin/payments'),
  confirmPayment: (id) => api.post(`/admin/payments/${id}/confirm`),
  refundPayment: (id, reason) => api.post(`/admin/payments/${id}/refund`, { reason }),
  getReports: () => api.get('/admin/reports'),
};
