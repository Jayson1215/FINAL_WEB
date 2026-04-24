import api from './api';

export const bookingService = {
  // Client bookings
  getMyBookings: () => api.get('/client/MyBookings'),
  getBookingDetail: (id) => api.get(`/client/MyBookings/${id}`),
  createBooking: (data) => api.post('/client/MyBookings', data),
  updateBooking: (id, data) => api.put(`/client/MyBookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/client/MyBookings/${id}`),
  requestCancellation: (id, reason) => api.post(`/client/MyBookings/${id}/cancel`, { reason }),
  getAddOns: () => api.get('/client/AddOns'),

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
