import api from './api';

export const bookingService = {
  // Client bookings
  getMyBookings: () => api.get('/client/bookings'),
  getBookingDetail: (id) => api.get(`/client/bookings/${id}`),
  createBooking: (data) => api.post('/client/bookings', data),
  updateBooking: (id, data) => api.put(`/client/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/client/bookings/${id}`),

  // Admin bookings
  getAllBookings: () => api.get('/admin/bookings'),
  updateBookingStatus: (id, status) => api.patch(`/admin/bookings/${id}/status`, { status }),
};
