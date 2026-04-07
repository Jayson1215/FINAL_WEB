import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      const redirectType = searchParams.get('redirect');
      if (redirectType === 'booking' && user.role === 'client') {
        const bookingIntent = localStorage.getItem('bookingIntent');
        if (bookingIntent) {
          const { serviceId } = JSON.parse(bookingIntent);
          localStorage.removeItem('bookingIntent');
          navigate(`/client/booking/${serviceId}`);
        } else {
          navigate('/client/dashboard');
        }
      } else {
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9] px-6 py-12 selection:bg-[#C79F68] selection:text-white">
      
      <div className="w-full max-w-[440px] animate-fadeIn">
        {/* Navigation Branding - Now integrated into the stack for better flow */}
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-serif text-[#333] tracking-[0.25em] hover:text-[#C79F68] transition-colors duration-500">L I G H T</Link>
        </div>

        <div className="bg-white p-10 md:p-12 shadow-premium border border-[#EEEEEE]">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C79F68] mb-3">Welcome Back</p>
            <h2 className="text-3xl font-serif text-[#333] leading-tight">Sign In</h2>
            <div className="w-12 h-px bg-[#C79F68] mx-auto mt-6 opacity-30"></div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-2 border-red-200 text-center">
              <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AAA]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#EEEEEE] py-3 text-sm focus:border-[#C79F68] outline-none transition-all duration-500 placeholder:text-[#DDD]"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AAA]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#EEEEEE] py-3 text-sm focus:border-[#C79F68] outline-none transition-all duration-500 placeholder:text-[#DDD]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#AAA] pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="accent-[#C79F68] w-3 h-3" />
                    <span className="group-hover:text-[#333] transition">Remember</span>
                </label>
                <a href="#" className="hover:text-[#C79F68] transition">Forgot?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C79F68] transition-all duration-700 disabled:opacity-50 shadow-sm mt-4 active:scale-[0.98]"
            >
              {loading ? 'Authenticating...' : 'Enter Studio'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center px-2">
                <div className="w-full h-px bg-[#EEEEEE]"></div>
              </div>
              <span className="relative px-4 bg-white text-[9px] font-bold uppercase tracking-[0.3em] text-[#CCC]">Or continue with</span>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/google/redirect`}
                className="w-full flex items-center justify-center gap-3 border border-[#EEEEEE] py-4 hover:bg-[#F9F9F9] transition-all duration-500 group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#333] group-hover:text-[#C79F68] transition-colors">Continue with Google</span>
              </button>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[#F5F5F5] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#AAA] mb-5">New to the Studio?</p>
            <Link
              to="/register"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#333] pb-1 hover:text-[#C79F68] hover:border-[#C79F68] transition-all duration-500"
            >
              Create Account
            </Link>
          </div>
        </div>
        
        <div className="mt-10 text-center">
            <Link to="/" className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#AAA] hover:text-[#333] transition-all duration-500">
                ← Back to Home
            </Link>
        </div>
      </div>
    </div>
  );
}
