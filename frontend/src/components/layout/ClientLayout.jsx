import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../common/NotificationBell';

export default function ClientLayout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  const navLinks = [
    { path: '/client/dashboard', label: 'Dashboard' },
    { path: '/client/portfolio', label: 'Gallery' },
    { path: '/client/services', label: 'Services' },
    { path: '/client/bookings', label: 'My Bookings' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#333333]">
      {/* Minimalist Top Navigation */}
      <nav className="bg-white border-b border-[#EEEEEE] py-6 px-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Serif Logo */}
          <Link to="/" className="hover:opacity-80 transition duration-300">
            <h2 className="text-3xl font-serif tracking-tight text-[#333]">
              PhotoStudio
            </h2>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${
                  location.pathname === link.path 
                    ? 'text-[#C79F68]' 
                    : 'text-[#777] hover:text-[#333]'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C79F68]"></span>
                )}
              </Link>
            ))}
            
            {/* User Dropdown/Logout */}
            <div className="flex items-center pl-6 border-l border-[#EEEEEE] space-x-6">
              <NotificationBell />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#AAA]">
                {user?.name}
              </span>
              <button
                onClick={handleLogoutClick}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#333] hover:text-[#C79F68] transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle (Simplified for now) */}
          <button className="md:hidden text-[#333] text-2xl">
            ☰
          </button>
        </div>
      </nav>

      {/* Page Header (Minimal) */}
      <header className="py-16 px-8 bg-white border-b border-[#EEEEEE] mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-[#333] mb-4 leading-tight">
            {title}
          </h1>
          <div className="w-12 h-[2px] bg-[#C79F68] mx-auto opacity-60"></div>
        </div>
      </header>

      {/* Main Content Area (Centered Column) */}
      <main className="max-w-7xl mx-auto px-8 pb-32">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="py-20 px-8 border-t border-[#EEEEEE] bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-serif text-[#333] mb-6">PhotoStudio</h3>
          <p className="text-[11px] uppercase tracking-widest text-[#AAA] mb-8">
            &copy; {new Date().getFullYear()} All Rights Reserved
          </p>
          <div className="flex justify-center space-x-8">
            <a href="#" className="text-[#777] hover:text-[#C79F68] transition tracking-widest text-[10px] uppercase font-bold">Instagram</a>
            <a href="#" className="text-[#777] hover:text-[#C79F68] transition tracking-widest text-[10px] uppercase font-bold">Facebook</a>
          </div>
        </div>
      </footer>

      {/* Logout Modal (Styled Minimalist) */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white p-12 max-w-md w-full shadow-2xl text-center border border-[#EEE]">
            <h2 className="text-3xl font-serif text-[#333] mb-4">Confirm Logout</h2>
            <p className="text-[#777] mb-10 text-sm leading-relaxed">
              Are you sure you want to end your session? Your booking progress will be saved.
            </p>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleConfirmLogout}
                className="w-full bg-[#333] text-white py-5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-[#C79F68] transition duration-500"
              >
                {isLoggingOut ? 'Logging out...' : 'Sign Out'}
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full bg-transparent text-[#333] py-5 text-[11px] font-bold uppercase tracking-[0.25em] border border-[#EEEEEE] hover:border-[#333] transition duration-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

