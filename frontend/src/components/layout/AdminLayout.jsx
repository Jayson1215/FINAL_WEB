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

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try { await logout(); navigate('/login'); }
    catch (err) { console.error('Logout error:', err); }
    finally { setIsLoggingOut(false); setShowLogoutModal(false); }
  };
  const handleCancelLogout = () => setShowLogoutModal(false);

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/services', label: 'Packages' },
    { path: '/admin/portfolio', label: 'Portfolio' },
    { path: '/admin/bookings', label: 'Bookings' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#F0F2F5] font-sans selection:bg-[#E8734A] selection:text-white">
      {/* Sidebar */}
      <aside className={`fixed md:static w-[270px] bg-white flex flex-col transition-all duration-500 z-40 h-screen border-r border-[#E2E8F0] shadow-lg ${sidebarOpen ? 'left-0' : '-left-[270px] md:left-0'
        }`}>
        {/* Logo */}
        <Link to="/" className="p-8 pb-6 hover:opacity-80 transition-all duration-500 block border-b border-[#F1F5F9]">
          <div className="text-center group">
            <h2 className="text-xl font-serif text-[#1E293B] tracking-[0.3em] group-hover:text-[#E8734A] transition-colors duration-500">L I G H T</h2>
            <div className="w-10 h-[2px] bg-gradient-to-r from-[#E8734A] to-[#FB923C] mx-auto mt-3 rounded-full"></div>
            <p className="text-[8px] text-[#94A3B8] font-bold uppercase tracking-[0.5em] mt-3">On-Call Manager</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3.5 transition-all duration-300 text-[11px] font-semibold uppercase tracking-[0.15em] relative group rounded-xl ${isActive(link.path)
                  ? 'text-[#E8734A] bg-[#FFF7ED]'
                  : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8F9FB]'
                }`}>
              {isActive(link.path) && (
                <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-gradient-to-b from-[#E8734A] to-[#FB923C] rounded-r-full"></span>
              )}
              <span className={`text-base transition-transform duration-300 group-hover:scale-110 ${isActive(link.path) ? '' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                {link.icon}
              </span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-5 py-6 border-t border-[#F1F5F9] space-y-4 bg-[#F8F9FB]">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E8734A] to-[#FB923C] flex items-center justify-center text-white text-sm font-bold mx-auto mb-2">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <p className="text-xs font-semibold text-[#1E293B] truncate">{user?.name}</p>
            <p className="text-[10px] text-[#94A3B8] truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogoutClick}
            className="w-full border border-[#E2E8F0] text-[#64748B] hover:bg-[#E8734A] hover:text-white hover:border-[#E8734A] font-semibold py-2.5 px-4 transition-all duration-300 text-[10px] uppercase tracking-[0.2em] rounded-xl">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="animate-fadeIn">
              <h1 className="text-2xl md:text-3xl font-serif text-[#1E293B] tracking-tight">{title}</h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gradient-to-r from-[#E8734A] to-[#FB923C] rounded-full"></span>
                On-Call Management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-3 hover:bg-[#F8F9FB] rounded-xl transition text-[#1E293B] text-xl">
                ☰
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-[#E2E8F0]">
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">Confirm Logout</h2>
            <p className="text-[#64748B] mb-6 text-sm leading-relaxed">Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <button onClick={handleCancelLogout} disabled={isLoggingOut} className="flex-1 px-5 py-3 bg-[#F0F2F5] text-[#1E293B] font-semibold rounded-xl hover:bg-[#E2E8F0] transition disabled:opacity-50 text-sm">Cancel</button>
              <button onClick={handleConfirmLogout} disabled={isLoggingOut} className="flex-1 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition disabled:opacity-50 text-sm">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && (<div className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-30" onClick={() => setSidebarOpen(false)}></div>)}
    </div>
  );
}
