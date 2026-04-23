import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function SocialCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { socialAuthComplete } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userDataStr = searchParams.get('user');
    if (token && userDataStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataStr));
        socialAuthComplete(userData, token);
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          const bookingIntent = localStorage.getItem('bookingIntent');
          if (bookingIntent) {
            const { serviceId } = JSON.parse(bookingIntent);
            localStorage.removeItem('bookingIntent');
            navigate(`/client/booking/${serviceId}`);
          } else {
            navigate('/client/home');
          }
        }
      } catch (err) {
        navigate('/login?error=Authentication failed');
      }
    } else {
      navigate('/login?error=Authentication failed');
    }
  }, [searchParams, navigate, socialAuthComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto"></div>
        <div className="space-y-2">
          <div className="flex justify-center">
            <Link to="/client/home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#1E293B] hover:text-[#E8734A] transition-all duration-500">
              LIGHT Studio
            </Link>
          </div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#94A3B8]">Finalizing your session...</p>
        </div>
      </div>
    </div>
  );
}
