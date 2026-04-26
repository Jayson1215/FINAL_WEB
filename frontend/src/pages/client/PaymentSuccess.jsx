import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const [status, setStatus] = useState('verifying');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'https://final-web-ls8m.onrender.com/api';
        await axios.post(`${apiBase}/payments/verify`, { session_id: sessionId });
        if (isMounted) {
          setStatus('success');
          setTimeout(() => nav('/client/MyBookings'), 2500);
        }
      } catch (err) {
        if (isMounted) setStatus('error');
      }
    };
    if (sessionId) verify();
    return () => { isMounted = false; };
  }, [sessionId, nav]);

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'serif' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '30px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        {status === 'verifying' && <h2 style={{ fontSize: '24px', color: '#000' }}>Verifying Payment...</h2>}
        {status === 'success' && (
          <div>
            <h2 style={{ fontSize: '28px', color: '#10b981' }}>Payment Received!</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>Redirecting to your bookings...</p>
          </div>
        )}
        {status === 'error' && (
          <div>
            <h2 style={{ fontSize: '24px', color: '#ef4444' }}>Verification Issue</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>Please check your bookings manually.</p>
            <button onClick={() => nav('/client/MyBookings')} style={{ marginTop: '20px', padding: '10px 20px', background: '#000', color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Go to My Bookings</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
