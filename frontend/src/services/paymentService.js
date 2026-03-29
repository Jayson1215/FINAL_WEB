import api from './api';

export const paymentService = {
  createPayment: (bookingId, paymentMethod) => 
    api.post('/client/payments', { booking_id: bookingId, payment_method: paymentMethod }),
  
  getAllPayments: () => api.get('/admin/payments'),
  getReports: () => api.get('/admin/reports'),
};
