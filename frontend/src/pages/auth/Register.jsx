import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 'client',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.passwordConfirmation, formData.role);
      const hasBookingIntent = localStorage.getItem('bookingIntent');
      if (hasBookingIntent) {
        navigate('/login?redirect=booking&email=' + encodeURIComponent(formData.email));
      } else {
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 selection:bg-[#E8734A] selection:text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6366F1]/5 blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E8734A]/5 blur-3xl"></div>

      <div className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-[#F1F5F9] grid grid-cols-1 lg:grid-cols-2">
        
        {/* Visual Sidebar */}
        <aside className="hidden lg:flex flex-col justify-between p-16 bg-[#1E293B] text-white relative overflow-hidden order-last">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-[#1E293B] to-[#334155]"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-[#E8734A]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-right">
            <Link to="/" className="text-4xl font-serif tracking-[0.25em] hover:text-[#E8734A] transition-all duration-500">LIGHT</Link>
            <div className="mt-20 space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#E8734A]">Join Our Community</p>
              <h1 className="text-5xl font-serif leading-[1.2]">A Legacy in Every Frame.</h1>
              <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs font-medium ml-auto">
                Create your account to start your journey with LIGHT. Reserve signature sessions and manage your visual assets seamlessly.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-10 flex justify-end">
             <div className="flex items-center gap-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Excellence captured daily</p>
                <div className="w-12 h-px bg-[#E8734A]"></div>
             </div>
          </div>
        </aside>

        {/* Form Section */}
        <section className="p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="text-4xl font-serif text-[#1E293B] tracking-[0.25em] hover:text-[#E8734A] transition-colors">LIGHT</Link>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-serif text-[#1E293B] mb-2 tracking-tight">Create Account</h2>
            <p className="text-sm text-[#94A3B8] font-medium">Become a member of our exclusive photography community.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
              <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1E293B] flex items-center gap-2">
                <span className="w-1 h-1 bg-[#E8734A] rounded-full"></span> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-2xl px-6 py-4 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all duration-500 placeholder:text-[#94A3B8]"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1E293B] flex items-center gap-2">
                <span className="w-1 h-1 bg-[#E8734A] rounded-full"></span> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-2xl px-6 py-4 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all duration-500 placeholder:text-[#94A3B8]"
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1E293B] flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#E8734A] rounded-full"></span> Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-2xl px-6 py-4 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all duration-500 placeholder:text-[#94A3B8]"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1E293B] flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#E8734A] rounded-full"></span> Confirm
                </label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F8F9FB] border border-[#E2E8F0] rounded-2xl px-6 py-4 text-sm text-[#1E293B] focus:border-[#E8734A] focus:ring-4 focus:ring-[#E8734A]/5 outline-none transition-all duration-500 placeholder:text-[#94A3B8]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#1E293B] to-[#334155] text-white py-5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-500 disabled:opacity-50 shadow-lg mt-4"
            >
              {loading ? (
                 <div className="flex items-center justify-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span>Creating Account...</span>
                 </div>
              ) : 'Start Your Journey'}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-[#F1F5F9] pt-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#94A3B8] mb-4">Already a member?</p>
            <Link to="/login" className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#1E293B] border-b-2 border-[#E8734A] pb-1 hover:text-[#E8734A] transition-all duration-500">
              Sign In to Account
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
