import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';

export default function ClientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchDashboardData(); }, []);
  const fetchDashboardData = async () => {
    try { setLoading(true); setError('');
      try { const r = await bookingService.getMyBookings(); setBookings(r.data); } catch(e){ setBookings([]); }
      try { const r = await paymentService.getReports(); setStats(r.data); } catch(e){ setStats(null); }
    } catch(e){ setError('Failed to load dashboard'); } finally { setLoading(false); }
  };

  const confirmedBookingsCount = bookings.filter(b=>b.status==='confirmed').length;
  const pendingBookingsCount = bookings.filter(b=>b.status==='pending').length;

  return (
    <ClientLayout title="Manage Your Visual Story." fullHero={true}>
      {error && (<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><p className="font-semibold mb-1">Error</p><p>{error}</p><button onClick={fetchDashboardData} className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold">Try Again</button></div>)}

      {loading ? (
        <div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#E8734A] rounded-full animate-spin mx-auto"></div></div>
      ) : (
        <div className="space-y-8 animate-fadeIn">
          {/* Welcome Banner with Video Background */}
          <div className="relative overflow-hidden rounded-3xl p-12 shadow-2xl min-h-[300px] flex items-center border border-white/10 group">
            <div className="absolute inset-0 z-0">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-1000"
              >
                <source src="https://cdn.coverr.co/videos/coverr-looking-at-a-camera-lens-4171/1080p.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1E293B] via-[#1E293B]/80 to-transparent"></div>
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E8734A] mb-3 animate-fadeIn">Welcome Back</p>
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 leading-tight">Your Photography <br /><span className="text-[#E8734A]">Command Center.</span></h1>
              <p className="text-sm text-white/70 leading-relaxed max-w-md italic font-medium">"Manage your on-call service requests and explore your visual legacy with masterful vision."</p>
            </div>
            
            {/* Subtle decorative elements */}
            <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-20 w-32 h-32 border border-white/5 rounded-full"></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label:'Total Requests', value:bookings.length, icon:'📸', gradient:'from-[#6366F1] to-[#818CF8]', bg:'bg-[#EEF2FF]', color:'text-[#6366F1]' },
              { label:'Approved', value:confirmedBookingsCount, icon:'✓', gradient:'from-[#10B981] to-[#34D399]', bg:'bg-[#ECFDF5]', color:'text-[#10B981]' },
              { label:'Pending', value:pendingBookingsCount, icon:'⏳', gradient:'from-[#F59E0B] to-[#FBBF24]', bg:'bg-[#FFFBEB]', color:'text-[#F59E0B]' },
            ].map((s,i)=>(
              <div key={i} className="bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300 border border-[#F1F5F9] group">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-lg`}>{s.icon}</div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">{s.label}</p>
                </div>
                <p className={`text-4xl font-bold ${s.color} mb-2`}>{s.value}</p>
                <div className={`w-full h-1 bg-[#F0F2F5] rounded-full`}><div className={`h-1 rounded-full bg-gradient-to-r ${s.gradient} w-3/4 group-hover:w-full transition-all duration-700`}></div></div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link to="/client/services" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-[#F1F5F9] hover:border-[#E8734A]/30 transition-all duration-300 flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#E8734A] to-[#FB923C] rounded-2xl flex items-center justify-center text-white text-xl shadow-md">✨</div>
                <div><h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#E8734A] transition">Request New Package</h3><p className="text-xs text-[#94A3B8]">Browse our on-call photography packages</p></div>
              </div>
            </Link>
            <Link to="/client/portfolio" className="group">
              <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-[#F1F5F9] hover:border-[#6366F1]/30 transition-all duration-300 flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center text-white text-xl shadow-md">🎨</div>
                <div><h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#6366F1] transition">View Gallery</h3><p className="text-xs text-[#94A3B8]">Explore our collection of work</p></div>
              </div>
            </Link>
          </div>

          {/* Recent */}
          {bookings.length>0 && (
            <div>
              <h2 className="text-xl font-bold text-[#1E293B] mb-5">Recent Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {bookings.slice(0,4).map(b=>(
                  <div key={b.id} className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-[#F1F5F9] transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#E8734A] transition">{b.service?.name}</h3>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${b.status==='confirmed'?'bg-[#ECFDF5] text-[#10B981]':b.status==='pending'?'bg-[#FFFBEB] text-[#F59E0B]':b.status==='rejected'?'bg-[#FEF2F2] text-[#EF4444]':'bg-[#F1F5F9] text-[#64748B]'}`}>
                        {b.status === 'confirmed' ? 'Approved' : b.status === 'rejected' ? 'Rejected' : b.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                       <p className="text-sm text-[#64748B] flex items-center gap-2"><span>📅</span>{new Date(b.booking_date).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</p>
                       <p className="text-[11px] text-[#94A3B8] flex items-center gap-2 truncate"><span>📍</span>{b.location || 'Location Not Specified'}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                      <span className="text-xl font-bold text-[#1E293B]">₱{parseFloat(b.total_amount||0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ClientLayout>
  );
}
