import api from './api';

const notificationService = {
  /**
   * Get all notifications for the authenticated user
   */
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (id) => {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  }
};

export default notificationService;
