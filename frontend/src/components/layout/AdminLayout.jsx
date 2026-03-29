import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Premium Sidebar */}
      <aside className={`fixed md:static w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 shadow-2xl flex flex-col transition-all duration-300 z-40 h-screen border-r border-slate-700/50 ${
        sidebarOpen ? 'left-0' : '-left-72 md:left-0'
      }`}>
        {/* Logo Section */}
        <Link to="/" className="p-8 hover:opacity-90 transition duration-300 block border-b border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              📸
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">PhotoStudio</h2>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Studio Manager</p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 text-sm font-semibold uppercase tracking-wide ${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
              {isActive(link.path) && <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-4 py-6 border-t border-slate-700/50 space-y-4">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Logged in as</p>
            <p className="font-semibold text-white truncate flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {user?.name}
            </p>
            <p className="text-xs text-amber-400 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-sm uppercase tracking-wide shadow-lg hover:shadow-red-600/30"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Premium Top Bar */}
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500 mt-1">Welcome to your photography studio management</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 text-2xl"
            >
              ☰
            </button>
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

