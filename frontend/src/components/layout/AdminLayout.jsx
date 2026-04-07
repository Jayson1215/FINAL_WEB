import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../common/NotificationBell';

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/services', label: 'Services', icon: '📸' },
    { path: '/admin/portfolio', label: 'Portfolio', icon: '🎨' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#F9F9F9] font-sans selection:bg-[#C79F68] selection:text-white">
      {/* Luxury Gallery Sidebar */}
      <aside className={`fixed md:static w-72 bg-white flex flex-col transition-all duration-500 z-40 h-screen border-r border-[#EEEEEE] ${
        sidebarOpen ? 'left-0' : '-left-72 md:left-0'
      }`}>
        {/* Logo Section - Iconic Serif Branding */}
        <Link to="/" className="p-12 hover:opacity-80 transition-all duration-700 block border-b border-[#F5F5F5]">
          <div className="text-center group">
            <h2 className="text-2xl font-serif text-[#1A1A1A] tracking-[0.3em] group-hover:text-[#C79F68] transition-colors duration-700">L I G H T</h2>
            <div className="w-8 h-px bg-[#C79F68] mx-auto mt-4 opacity-40"></div>
            <p className="text-[8px] text-[#AAA] font-bold uppercase tracking-[0.5em] mt-4">Studio Manager</p>
          </div>
        </Link>

        {/* Navigation - Minimalist & Refined */}
        <nav className="flex-1 px-0 py-10 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-5 px-10 py-5 transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.25em] relative group ${
                isActive(link.path)
                  ? 'text-[#1A1A1A] bg-[#F9F9F9]'
                  : 'text-[#999] hover:text-[#1A1A1A]'
              }`}
            >
              {/* Active Indicator Line */}
              {isActive(link.path) && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#C79F68] animate-slideIn"></span>
              )}
              
              <span className={`text-lg transition-transform duration-500 group-hover:scale-110 ${isActive(link.path) ? 'text-[#C79F68]' : 'grayscale opacity-50 text-slate-400 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section - Understated Elegance */}
        <div className="px-8 py-10 border-t border-[#F5F5F5] space-y-6 bg-white">
          <div className="text-center">
            <p className="text-[8px] text-[#BBB] uppercase tracking-[0.3em] font-bold mb-3">Logged in as</p>
            <p className="text-xs font-serif text-[#1A1A1A] tracking-wider truncate mb-1">
              {user?.name}
            </p>
            <p className="text-[9px] text-[#C79F68] tracking-widest lowercase">{user?.email}</p>
          </div>
          
          <button
            onClick={handleLogoutClick}
            className="w-full border border-[#EEEEEE] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] font-bold py-4 px-4 transition-all duration-700 text-[9px] uppercase tracking-[0.3em] active:scale-[0.98]"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Understated Top Bar */}
        <div className="bg-white border-b border-[#F5F5F5]">
          <div className="flex items-center justify-between px-8 py-8 md:py-10">
            <div className="animate-fadeIn">
              <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] tracking-tight">{title}</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BBB] mt-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-[#C79F68] rounded-full"></span>
                Studio Management Overview
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-3 hover:bg-[#F9F9F9] rounded-full transition-all duration-500 text-[#1A1A1A] text-2xl"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Confirm Logout</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">Are you sure you want to log out? You'll need to sign in again to access your studio dashboard.</p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

