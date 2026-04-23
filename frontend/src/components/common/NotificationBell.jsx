import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const getFallbackPath = (notif) => {
    const title = String(notif?.title || '').toLowerCase();
    const message = String(notif?.message || '').toLowerCase();

    if (user?.role === 'client') {
      return '/client/MyBookings';
    }

    if (title.includes('booking') || message.includes('booking') || title.includes('session') || message.includes('session')) {
      return '/admin/bookings';
    }
    if (title.includes('user') || title.includes('register') || message.includes('user')) {
      return '/admin/users';
    }
    if (title.includes('payment') || title.includes('paid')) {
      return '/admin/bookings';
    }
    if (title.includes('report') || title.includes('revenue')) {
      return '/admin/reports';
    }

    return '/admin/dashboard';
  };

  const getNotificationPath = (notif) => {
    const rawLink = String(notif?.link || '').trim();

    if (rawLink.startsWith('/')) {
      return rawLink;
    }

    if (/^https?:\/\//i.test(rawLink)) {
      try {
        const parsed = new URL(rawLink);
        if (parsed.pathname) {
          return `${parsed.pathname}${parsed.search}`;
        }
      } catch {
        // Fall back to role/title based path
      }
    }

    return getFallbackPath(notif);
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.data || []);
      setUnreadCount(data.data ? data.data.filter(n => !n.read_at).length : 0);
    } catch (error) { console.error('Failed to fetch notifications:', error); }
  };

  useEffect(() => {
    if (!user) return undefined;

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 8000);
    const handleVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisible);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisible);
    };
  }, [user]);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read_at) {
        await notificationService.markAsRead(notif.id);
        setNotifications((prev) => prev.map((item) => (
          item.id === notif.id ? { ...item, read_at: new Date().toISOString() } : item
        )));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      const destination = getNotificationPath(notif);
      navigate(destination);

      setIsOpen(false);
    } catch (e) {
      console.error('Notification navigation error:', e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read_at: notif.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch (e) {
      console.error('Failed to mark all notifications as read:', e);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-[#94A3B8] hover:text-[#1E293B] transition-colors focus:outline-none">
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#E8734A] to-[#FB923C] ring-2 ring-white" />}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] shadow-xl z-50 overflow-hidden rounded-xl animate-fadeIn">
          <div className="p-4 border-b border-[#F1F5F9] flex justify-between items-center bg-[#F8F9FB]">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1E293B]">Notifications</h3>
            {unreadCount > 0 && <button onClick={handleMarkAllAsRead} className="text-[9px] font-bold uppercase tracking-widest text-[#E8734A] hover:text-[#FB923C]">Mark All Read</button>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? notifications.map((notif) => (
              <div key={notif.id} onClick={() => handleNotificationClick(notif)}
                className={`p-4 border-b border-[#F8F9FB] cursor-pointer transition-all duration-300 ${!notif.read_at ? 'bg-[#FFF7ED] hover:bg-[#FFEDD5]' : 'hover:bg-[#F8F9FB]'}`}>
                <p className="text-[11px] font-bold text-[#1E293B] mb-1">{notif.title}</p>
                <p className="text-[11px] text-[#64748B] leading-relaxed line-clamp-2">{notif.message}</p>
                <p className="text-[9px] text-[#94A3B8] mt-2 uppercase tracking-wider font-bold">
                  {new Date(notif.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )) : (<div className="p-12 text-center"><p className="text-[11px] text-[#94A3B8] italic font-medium">Your concierge desk is quiet.</p></div>)}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 bg-[#F8F9FB] border-t border-[#F1F5F9] text-center">
              <button
                onClick={() => {
                  navigate(user.role === 'client' ? '/client/MyBookings' : '/admin/dashboard');
                  setIsOpen(false);
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] hover:text-[#E8734A]"
              >
                {user.role === 'client' ? 'Go To My Bookings' : 'Dashboard Overview'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default NotificationBell;
