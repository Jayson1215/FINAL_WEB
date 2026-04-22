import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

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
          navigate('/');
        }
      } else {
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 selection:bg-[#E8734A] selection:text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E8734A]/5 blur-3xl"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6366F1]/5 blur-3xl"></div>

      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#F1F5F9] grid grid-cols-1 lg:grid-cols-2">
        
        {/* Visual Sidebar */}
        <aside className="hidden lg:flex flex-col justify-between p-12 bg-[#1E293B] text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1E293B] to-[#334155]"></div>
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Link to="/" className="text-3xl font-serif tracking-[0.25em] hover:text-[#E8734A] transition-all duration-500">LIGHT</Link>
            <div className="mt-16 space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">The Photography Portal</p>
              <h1 className="text-4xl font-serif leading-[1.2] max-w-sm">Elevate Your Visual Narrative.</h1>
              <p className="text-[#94A3B8] text-xs leading-relaxed max-w-xs font-medium italic">
                "Sign in to manage your appointments, download your masterpieces, and explore our premium photography collections."
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-10">
             <div className="flex items-center gap-4">
                <div className="w-10 h-px bg-[#E8734A]"></div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">Professionalism in every pixel</p>
             </div>
          </div>
        </aside>

        {/* Form Section */}
        <section className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-3xl font-serif text-[#1E293B] tracking-[0.25em] hover:text-[#E8734A] transition-colors">LIGHT</Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-serif text-[#1E293B] mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-[#94A3B8] font-medium">Please enter your details to access your account.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-center animate-shake">
              <p className="text-[9px] text-red-600 font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1E293B] flex items-center gap-2">
                <span className="w-1 h-1 bg-[#E8734A] rounded-full"></span> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-xs text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all duration-500 placeholder:text-[#94A3B8]"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1E293B] flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#E8734A] rounded-full"></span> Password
                </label>
                <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] hover:text-[#E8734A] transition-colors">Forgot?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-xl px-5 py-3.5 text-xs text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all duration-500 placeholder:text-[#94A3B8]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-3 py-1">
              <input type="checkbox" id="remember" className="w-3.5 h-3.5 rounded-md border-[#E2E8F0] text-[#E8734A] focus:ring-[#E8734A]/20 cursor-pointer" />
              <label htmlFor="remember" className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] cursor-pointer hover:text-[#1E293B] transition-colors">Remember for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E293B] text-white py-4.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:shadow-xl hover:translate-y-[-1px] transition-all duration-500 disabled:opacity-50 shadow-md"
            >
              {loading ? (
                 <div className="flex items-center justify-center gap-2">
                   <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Authenticating...</span>
                 </div>
              ) : 'Access Portal'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-[#F1F5F9]"></div>
              </div>
              <span className="relative px-4 bg-white text-[9px] font-bold uppercase tracking-[0.2em] text-[#94A3B8]">Social Authentication</span>
            </div>

            <button
              onClick={() => {
                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const cleanBase = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
                window.location.href = `${cleanBase}/auth/google/redirect`;
              }}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#F1F5F9] py-3.5 rounded-xl hover:bg-[#F8F9FB] hover:border-[#E2E8F0] transition-all duration-500 group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#1E293B]">Continue with Google</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#94A3B8] mb-3">Don't have an account?</p>
            <Link to="/register" className="inline-block px-8 py-2.5 rounded-lg border border-[#E2E8F0] text-[9px] font-bold uppercase tracking-[0.3em] text-[#1E293B] hover:bg-[#1E293B] hover:text-white transition-all duration-500 shadow-sm">
              Create Profile
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
