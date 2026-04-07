import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import notificationService from '../../services/notificationService';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.data || []);
      // Calculate unread from the data
      const unread = data.data ? data.data.filter(n => !n.read_at).length : 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 45 seconds
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#777] hover:text-[#333] transition-colors focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-[#C79F68] ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-[#EEEEEE] shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-[#EEEEEE] flex justify-between items-center bg-[#F9F9F9]">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#333]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[9px] font-bold uppercase tracking-widest text-[#C79F68] hover:text-[#A67C45]"
              >
                Mark All Read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-4 border-b border-[#F5F5F5] cursor-pointer transition-colors ${
                    !notif.read_at ? 'bg-[#FFFBF5]' : 'hover:bg-[#FDFDFD]'
                  }`}
                >
                  <p className="text-[11px] font-bold text-[#333] mb-1">{notif.title}</p>
                  <p className="text-[11px] text-[#777] leading-relaxed line-clamp-2">{notif.message}</p>
                  <p className="text-[9px] text-[#AAA] mt-2 font-serif uppercase tracking-tighter italic">
                    {new Date(notif.created_at).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-[11px] text-[#AAA] italic font-serif">No new updates found.</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 bg-[#F9F9F9] border-t border-[#EEEEEE] text-center">
              <button className="text-[10px] font-bold uppercase tracking-widest text-[#AAA] hover:text-[#777]">
                View All Activity
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
