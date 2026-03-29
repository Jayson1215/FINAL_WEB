import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BackgroundAnimation = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3,
      size: 2 + Math.random() * 6
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
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
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animated-blob-1 {
          animation: float 15s infinite ease-in-out;
        }
        
        .animated-blob-2 {
          animation: float-reverse 18s infinite ease-in-out;
        }
        
        .animated-blob-3 {
          animation: float 20s infinite ease-in-out;
        }
        
        .pulse-border {
          animation: pulse-glow 3s infinite ease-in-out;
        }
        
        .shimmer-effect {
          animation: shimmer 3s infinite;
        }
        
        .gradient-animated {
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>

      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-animated bg-gradient-to-br from-white via-gray-50 to-white"></div>

      {/* Animated Blob 1 - Gray */}
      <div className="animated-blob-1 absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-gray-300 to-gray-400 opacity-5 rounded-full blur-3xl"></div>

      {/* Animated Blob 2 - Gray */}
      <div className="animated-blob-2 absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-gray-300 to-gray-400 opacity-5 rounded-full blur-3xl"></div>

      {/* Animated Blob 3 - Gray */}
      <div className="animated-blob-3 absolute top-1/3 -right-20 w-72 h-72 bg-gradient-to-br from-gray-300 to-gray-400 opacity-3 rounded-full blur-3xl"></div>

      {/* Central glow effect */}
      <div className="pulse-border absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-gradient-to-r from-gray-200 via-transparent to-gray-200 opacity-10 rounded-full blur-3xl"></div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(55, 65, 81, ${particle.opacity}), transparent)`,
            animation: `float ${particle.duration}s infinite ease-in-out`,
            animationDelay: `${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(55, 65, 81, ${particle.opacity * 0.5})`
          }}
        ></div>
      ))}

      {/* Shimmer overlay effect */}
      <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5 pointer-events-none"></div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(169, 169, 169, .05) 25%, rgba(169, 169, 169, .05) 26%, transparent 27%, transparent 74%, rgba(169, 169, 169, .05) 75%, rgba(169, 169, 169, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(169, 169, 169, .05) 25%, rgba(169, 169, 169, .05) 26%, transparent 27%, transparent 74%, rgba(169, 169, 169, .05) 75%, rgba(169, 169, 169, .05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}
      ></div>
    </>
  );
};

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
      
      // Check if there's a booking redirect
      const redirectType = searchParams.get('redirect');
      if (redirectType === 'booking' && user.role === 'client') {
        const bookingIntent = localStorage.getItem('bookingIntent');
        if (bookingIntent) {
          const { serviceId } = JSON.parse(bookingIntent);
          // Clear the booking intent after using it
          localStorage.removeItem('bookingIntent');
          navigate(`/client/booking/${serviceId}`);
        } else {
          navigate('/client/dashboard');
        }
      } else {
        // Normal redirect based on role
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-white">
      {/* Background with animations */}
      <BackgroundAnimation />

      {/* Back Button */}
      <button
        onClick={() => {
          localStorage.removeItem('bookingIntent');
          navigate('/');
        }}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-black transition font-semibold text-sm uppercase tracking-wider hover:bg-gray-100 rounded-lg border border-gray-300"
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
                  <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-900/20 border border-gray-700">
                    <span className="text-4xl">📸</span>
                  </div>
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-3">LIGHT</h1>
                <p className="text-lg text-gray-600 font-light">Professional Photography Studio</p>
              </div>

              {/* Premium Features */}
              <div className="space-y-6 pt-12">
                <div className="flex gap-4 items-start">
                  <div className="text-3xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Professional Sessions</h3>
                    <p className="text-gray-600 text-sm">Expert photographers with years of experience</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-3xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Premium Editing</h3>
                    <p className="text-gray-600 text-sm">Studio-quality retouching and color correction</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="text-3xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Fast Delivery</h3>
                    <p className="text-gray-600 text-sm">Your photos ready within 48 hours</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-12 border-t border-gray-300">
                <div>
                  <p className="text-3xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-600">Happy Clients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">15+</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">4.9★</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Premium Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-300 hover:border-gray-400 transition duration-300">
              {/* Header */}
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600 text-base font-light">Access your account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
                  <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">⚠️</span> {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-gray-900 text-sm font-semibold mb-3">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-lg">✉️</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition font-medium"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-900 text-sm font-semibold mb-3">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-lg">🔐</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-gray-800" />
                    <span className="text-sm text-gray-700 font-medium">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 font-semibold transition">
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition duration-300 mt-8 shadow-lg border border-gray-700 text-lg uppercase tracking-wider hover:shadow-xl hover:shadow-gray-900/20"
                >
                  {loading ? '⏳ Signing In...' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-gray-500 text-sm font-medium">New here?</span>
                </div>
              </div>

              {/* Register Button */}
              <Link
                to="/register"
                className="block w-full text-center border-2 border-gray-300 text-gray-900 hover:bg-gray-50 py-3 rounded-xl font-bold transition duration-300 text-lg"
              >
                Create Account
              </Link>

              {/* Security Info */}
              <div className="mt-10 pt-6 border-t border-gray-300">
                <p className="text-xs text-gray-600 text-center font-light">
                  🔒 Your data is encrypted and secured with 256-bit SSL encryption
                </p>
              </div>
            </div>

            {/* Mobile Branding - Show on small screens */}
            <div className="lg:hidden mt-8 text-center space-y-4">
              <div className="inline-block">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg shadow-gray-900/20 border border-gray-700">
                  <span className="text-2xl">📸</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">LIGHT Studio</h2>
              <p className="text-gray-600 text-sm">Professional Photography Services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
