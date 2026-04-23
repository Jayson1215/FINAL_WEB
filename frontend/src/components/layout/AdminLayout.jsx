import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../common/NotificationBell';

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setProfileOpen(false);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try { await logout(); navigate('/login'); }
    catch (err) { console.error('Logout error:', err); }
    finally { setIsLoggingOut(false); setShowLogoutModal(false); }
  };

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/services', label: 'Services' },
    { path: '/admin/portfolio', label: 'Portfolio' },
    { path: '/admin/bookings', label: 'Bookings' },
    { path: '/admin/users', label: 'System Users' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans selection:bg-[#E8734A] selection:text-white">
      {/* Sidebar - Light Professional Style with Black Borders */}
      <aside className={`fixed md:static w-[260px] bg-white flex flex-col transition-all duration-300 z-40 h-screen border-r border-black/20 ${sidebarOpen ? 'left-0' : '-left-[260px] md:left-0'}`}>
        
        {/* Branding */}
        <div className="h-20 flex items-center px-10 border-b border-black/20">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm group-hover:bg-[#E8734A] transition-colors">
              <span className="text-white text-[10px] font-bold italic">LW</span>
            </div>
            <h2 className="text-xs font-bold text-black uppercase tracking-[0.25em]">Lightworks</h2>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto">
          {navLinks.map((link, index) => (
            <React.Fragment key={link.path}>
              <Link to={link.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 text-[11px] font-bold uppercase tracking-widest rounded-xl relative group ${isActive(link.path)
                    ? 'text-[#E8734A] bg-orange-50/50'
                    : 'text-black hover:bg-slate-50'
                  }`}>
                {isActive(link.path) && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#E8734A] rounded-r-full"></span>
                )}
                <span>{link.label}</span>
              </Link>
              {/* Row Line (Divider) */}
              {index < navLinks.length - 1 && <div className="h-[1px] bg-black/10 mx-6 my-1"></div>}
            </React.Fragment>
          ))}
        </nav>

        {/* Support Section */}
        <div className="p-6 border-t border-black/20">
          <div className="bg-slate-50 rounded-2xl p-5 border border-black/10">
            <p className="text-[9px] font-bold text-black opacity-40 uppercase tracking-widest mb-3">System Status</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-black font-bold uppercase tracking-tight">Healthy</p>
              </div>
              <p className="text-[10px] text-black opacity-40 font-mono">v1.2</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header with Black Borders */}
        <header className="h-20 bg-white border-b border-black/20 flex items-center justify-between px-10 z-30 shadow-sm">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-black text-xl md:hidden">☰</button>
            <div className="flex items-center gap-4">
               <div className="w-1 h-6 bg-black/20 rounded-full"></div>
               <h1 className="text-sm font-bold text-black uppercase tracking-[0.2em]">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <NotificationBell />
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-4 group pl-4 border-l border-black/20">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-black uppercase tracking-widest">{user?.name}</p>
                  <p className="text-[9px] text-black opacity-40 font-bold uppercase tracking-tighter">System Admin</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-black/20 flex items-center justify-center font-bold text-black group-hover:border-[#E8734A] group-hover:text-[#E8734A] transition-all">
                  {user?.name?.charAt(0)}
                </div>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-black/20 z-20 py-3 animate-fadeIn">
                    <div className="px-5 py-3 border-b border-black/10 mb-2">
                      <p className="text-[9px] font-bold text-black opacity-40 uppercase tracking-widest mb-1">Authenticated as</p>
                      <p className="text-[11px] font-bold text-black truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleLogoutClick} className="w-full text-left px-5 py-3 text-[10px] font-bold text-red-500 hover:bg-red-50 transition-colors uppercase tracking-[0.2em]">
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 md:p-12 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>

      {/* Confirmation Modal with Black Borders */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-md flex items-center justify-center z-[1000] p-6 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 max-w-sm w-full border border-black/10 animate-slideUp text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            <h2 className="text-xl font-bold text-black mb-2 tracking-tight">Confirm Logout</h2>
            <p className="text-[11px] text-black opacity-60 font-bold uppercase tracking-widest mb-10">End your active session?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-4 bg-slate-50 text-black font-bold rounded-2xl hover:bg-slate-100 transition text-[10px] uppercase tracking-widest">Wait, No</button>
              <button onClick={handleConfirmLogout} disabled={isLoggingOut} className="flex-1 py-4 bg-black text-white font-bold rounded-2xl hover:bg-[#E8734A] transition text-[10px] uppercase tracking-widest shadow-lg">
                {isLoggingOut ? '...' : 'Yes, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
