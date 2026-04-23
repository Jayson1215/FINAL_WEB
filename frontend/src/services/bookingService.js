import api from './api';

export const bookingService = {
  // Client bookings
  getMyBookings: () => api.get('/client/bookings'),
  getBookingDetail: (id) => api.get(`/client/bookings/${id}`),
  createBooking: (data) => api.post('/client/bookings', data),
  updateBooking: (id, data) => api.put(`/client/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/client/bookings/${id}`),
  requestCancellation: (id, reason) => api.post(`/client/bookings/${id}/cancel`, { reason }),

  // Admin bookings
  getAllBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id, statusOrPayload, adminNotes = null) => {
    const payload = typeof statusOrPayload === 'object'
      ? statusOrPayload
      : { status: statusOrPayload, ...(adminNotes !== null ? { admin_notes: adminNotes } : {}) };

    return api.patch(`/admin/bookings/${id}/status`, payload);
  },
  processRefund: (id) => api.post(`/admin/bookings/${id}/refund`),
};
