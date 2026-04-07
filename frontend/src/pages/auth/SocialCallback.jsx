import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
        
        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          // Check for booking intent
          const bookingIntent = localStorage.getItem('bookingIntent');
          if (bookingIntent) {
            const { serviceId } = JSON.parse(bookingIntent);
            localStorage.removeItem('bookingIntent');
            navigate(`/client/booking/${serviceId}`);
          } else {
            navigate('/client/dashboard');
          }
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
        navigate('/login?error=Authentication failed');
      }
    } else {
      navigate('/login?error=Authentication failed');
    }
  }, [searchParams, navigate, socialAuthComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C79F68] mx-auto mb-4"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#AAA]">Completing Authentication...</p>
      </div>
    </div>
  );
}
