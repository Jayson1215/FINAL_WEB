import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.passwordConfirmation,
        formData.role
      );
      
      // If there's a booking intent, redirect to login which will handle the booking redirect
      // The booking intent is already in localStorage from the Landing page
      const hasBookingIntent = localStorage.getItem('bookingIntent');
      if (hasBookingIntent) {
        navigate('/login?redirect=booking&email=' + encodeURIComponent(formData.email));
      } else {
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-50">
      {/* Luxury Background with animated blobs */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-30px) translateX(20px); }
          50% { transform: translateY(-60px) translateX(-20px); }
          75% { transform: translateY(-30px) translateX(20px); }
        }
        
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(30px) translateX(-20px); }
          50% { transform: translateY(60px) translateX(20px); }
          75% { transform: translateY(30px) translateX(-20px); }
        }
        
        .register-blob-1 { animation: float 15s infinite ease-in-out; }
        .register-blob-2 { animation: float-reverse 18s infinite ease-in-out; }
      `}</style>

      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-amber-50 to-slate-100"></div>

      {/* Animated blobs */}
      <div className="register-blob-1 absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-300 to-amber-400 opacity-20 rounded-full blur-3xl"></div>
      <div className="register-blob-2 absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-300 to-blue-400 opacity-15 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <button
        onClick={() => {
          localStorage.removeItem('bookingIntent');
          navigate('/');
        }}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition font-semibold text-sm uppercase tracking-wider hover:bg-white rounded-lg"
      >
        ← Back
      </button>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Premium Branding */}
          <div className="hidden lg:block">
            <div className="space-y-8">
              {/* Logo & Brand */}
              <div>
                <div className="inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30">
                    <span className="text-4xl">📸</span>
                  </div>
                </div>
                <h1 className="text-5xl font-bold text-slate-900 mb-3">Elite Studio</h1>
                <p className="text-lg text-slate-600 font-light">Premium Photography Services</p>
              </div>

              {/* Join Reasons */}
              <div className="space-y-6 pt-12">
                <div className="flex gap-4 items-start">
                  <div className="text-3xl">👥</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Community</h3>
                    <p className="text-slate-600 text-sm">Join thousands of satisfied clients worldwide</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Easy Booking</h3>
                    <p className="text-slate-600 text-sm">Schedule your session in minutes</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-3xl">💎</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Premium Quality</h3>
                    <p className="text-slate-600 text-sm">Professional results every time</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-12 border-t border-slate-200">
                <div>
                  <p className="text-3xl font-bold text-amber-600">500+</p>
                  <p className="text-sm text-slate-600">Happy Members</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-600">15+</p>
                  <p className="text-sm text-slate-600">Years Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-600">4.9★</p>
                  <p className="text-sm text-slate-600">Average Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Premium Registration Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-slate-100">
              {/* Header */}
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h2>
                <p className="text-slate-600 text-base font-light">Join our photography community</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
                  <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">⚠️</span> {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label className="block text-slate-900 text-sm font-semibold mb-3">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-lg">👤</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-slate-900 text-sm font-semibold mb-3">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-lg">✉️</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition font-medium"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Account Type Field */}
                <div>
                  <label className="block text-slate-900 text-sm font-semibold mb-3">Account Type</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-lg">👨‍💼</span>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition font-medium appearance-none cursor-pointer"
                    >
                      <option value="client" className="bg-white text-slate-900">Client (Book Sessions)</option>
                      <option value="admin" className="bg-white text-slate-900">Admin (Manage Studio)</option>
                    </select>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-slate-900 text-sm font-semibold mb-3">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-lg">🔐</span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-slate-900 text-sm font-semibold mb-3">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-lg">🔐</span>
                    <input
                      type="password"
                      name="passwordConfirmation"
                      value={formData.passwordConfirmation}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition duration-300 mt-8 shadow-lg shadow-amber-500/20 text-lg uppercase tracking-wider"
                >
                  {loading ? '⏳ Creating Account...' : 'Create My Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-slate-500 text-sm font-medium">Already a member?</span>
                </div>
              </div>

              {/* Login Button */}
              <Link
                to="/login"
                className="block w-full text-center border-2 border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-600 py-3 rounded-xl font-bold transition duration-300 text-lg"
              >
                Back to Login
              </Link>

              {/* Security Info */}
              <div className="mt-10 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center font-light">
                  🔒 Your data is encrypted and secured with 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Mobile Branding - Show on small screens */}
            <div className="lg:hidden mt-8 text-center space-y-4">
              <div className="inline-block">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="text-2xl">📸</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Elite Studio</h2>
              <p className="text-slate-600 text-sm">Premium Photography Services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
