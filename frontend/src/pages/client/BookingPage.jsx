import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import LocationPickerMap from '../../components/common/LocationPickerMap';

export default function BookingPage() {
  const { serviceId } = useParams();
  const nav = useNavigate();
  const [d, setD] = useState({ s: null, loading: true, sub: false, err: '' });
  const [f, setF] = useState({ date: '', time: '', loc: '', note: '' });

  useEffect(() => {
    (async () => {
      try { const r = await serviceService.getServiceDetail(serviceId); setD({ s: r.data, loading: false, sub: false, err: '' }); }
      catch (e) { setD(p => ({ ...p, loading: false, err: 'Failed' })); }
    })();
  }, [serviceId]);

  const submit = async (e) => {
    e.preventDefault();
    setD(p => ({ ...p, sub: true, err: '' }));
    try {
      const res = await bookingService.createBooking({
        service_id: serviceId, booking_date: f.date, booking_time: f.time,
        location: f.loc, special_requests: f.note, total_amount: d.s.price
      });
      nav(`/client/MyBookings?booking=${res.data.id}&highlight=1`);
    } catch (err) { setD(p => ({ ...p, sub: false, err: err.response?.data?.message || 'Error' })); }
  };

  if (d.loading) return <ClientLayout title="..."><div className="h-96 flex items-center justify-center animate-pulse">Loading...</div></ClientLayout>;

  return (
    <ClientLayout title="Reserve Session">
      <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
        {d.err && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs font-bold text-center border">{d.err}</div>}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
              <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-widest mb-2">Package</p>
              <h2 className="text-3xl font-serif text-[#1E293B] mb-4">{d.s.name}</h2>
              <p className="text-sm italic text-gray-500">"{d.s.description}"</p>
              <div className="mt-8 pt-8 border-t flex justify-between items-center font-bold">
                <span className="text-gray-400 text-xs">INVESTMENT</span>
                <span className="text-2xl text-[#1E293B]">₱{parseFloat(d.s.price).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <form onSubmit={submit} className="bg-white p-8 rounded-[2rem] border shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-[8px] font-bold text-gray-400 uppercase">Date</p><input type="date" required className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={f.date} onChange={e => setF({...f, date: e.target.value})} /></div>
              <div className="space-y-1"><p className="text-[8px] font-bold text-gray-400 uppercase">Time</p><input type="time" required className="w-full bg-gray-50 p-4 rounded-xl text-xs" value={f.time} onChange={e => setF({...f, time: e.target.value})} /></div>
            </div>
            <div className="space-y-1"><p className="text-[8px] font-bold text-gray-400 uppercase">Venue</p><input type="text" required className="w-full bg-gray-50 p-4 rounded-xl text-xs" placeholder="Venue Address" value={f.loc} onChange={e => setF({...f, loc: e.target.value})} /></div>
            <LocationPickerMap locationText={f.loc} onLocationSelect={({address}) => setF({...f, loc: address})} height="200px" />
            <button type="submit" disabled={d.sub} className="w-full bg-[#1E293B] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">{d.sub ? 'Booking...' : 'Confirm Request'}</button>
          </form>
        </div>
      </div>
    </ClientLayout>
  );
}
