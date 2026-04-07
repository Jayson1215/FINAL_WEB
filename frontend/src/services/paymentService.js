import api from './api';

export const paymentService = {
  createPayment: (bookingId, paymentMethod, type = 'full') => 
    api.post('/client/payments', { 
      booking_id: bookingId, 
      payment_method: paymentMethod,
      type: type
    }),
  
  getAllPayments: () => api.get('/admin/payments'),
  confirmPayment: (paymentId) => api.post(`/admin/payments/${paymentId}/confirm`),
  getReports: () => api.get('/admin/reports'),
};
