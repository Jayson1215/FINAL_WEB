import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ClientLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    { path: '/client/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/client/portfolio', label: 'Gallery', icon: '🎨' },
    { path: '/client/services', label: 'Services', icon: '📸' },
    { path: '/client/bookings', label: 'Bookings', icon: '📅' },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Client Sidebar - Light for Client Area */}
      <aside className={`fixed md:static w-64 bg-white border-r-2 border-gray-300 shadow-sm p-6 flex flex-col transition-all duration-300 z-40 h-screen ${
        sidebarOpen ? 'left-0' : '-left-64 md:left-0'
      }`}>
        <Link to="/" className="mb-8 hover:opacity-80 transition duration-300 block">
          <div>
            <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
              CLIENT
            </div>
            <h2 className="text-2xl font-display font-bold text-black">
              PhotoStudio
            </h2>
            <p className="text-gray-600 text-xs uppercase tracking-wider">User Portal</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition duration-300 font-semibold text-sm uppercase tracking-wider flex items-center gap-3"
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t-2 border-gray-300 space-y-4">
          <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
            <p className="text-gray-600 text-xs uppercase tracking-wider font-semibold mb-1">Logged in as</p>
            <p className="font-display font-semibold text-black truncate">{user?.name}</p>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-full bg-green-100 text-green-700 border border-green-300 py-3 px-4 rounded-lg hover:bg-green-200 transition font-semibold text-sm uppercase tracking-wider"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Clean for Client */}
        <div className="bg-white border-b-2 border-gray-300 shadow-sm p-4 md:p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-black">{title}</h1>
            <p className="text-sm text-gray-600">Client Dashboard</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition text-black"
          >
            ☰
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-white">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm mx-4">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Confirm Logout</h2>
            <p className="text-gray-700 mb-8">Are you sure you want to log out? You'll need to sign in again to access your bookings and account.</p>
            
            <div className="flex gap-4">
              <button
                onClick={handleCancelLogout}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No, Stay
              </button>
              <button
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

