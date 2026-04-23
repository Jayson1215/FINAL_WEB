import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/layout/ClientLayout';
import { bookingService } from '../../services/bookingService';
import { resolveServiceImageUrl } from '../../utils/imageUrl';

export default function MyBookings() {
  const nav = useNavigate();
  const [d, setD] = useState({ list: [], loading: true, sel: null });

  useEffect(() => {
    (async () => {
      try { const r = await bookingService.getMyBookings(); setD({ list: r.data || [], loading: false, sel: null }); }
      catch (e) { setD(p => ({ ...p, loading: false })); }
    })();
  }, []);

  const cancel = async (id) => {
    if (window.confirm('Cancel?')) {
      await bookingService.cancelBooking(id);
      setD(p => ({ ...p, list: p.list.map(b => b.id === id ? { ...b, status: 'cancelled' } : b) }));
    }
  };

  if (d.loading) return <ClientLayout title="..."><div className="h-96 flex items-center justify-center animate-pulse">Loading...</div></ClientLayout>;

  return (
    <ClientLayout title="Your Registry">
      <div className="max-w-5xl mx-auto space-y-12 animate-fadeIn">
        {d.list.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border shadow-sm">
            <p className="text-gray-400 italic mb-8">Registry is empty.</p>
            <button onClick={() => nav('/client/Packages')} className="bg-[#E8734A] text-white px-10 py-5 rounded-2xl text-[10px] font-bold uppercase">Explore Collections</button>
          </div>
        ) : (
          <div className="grid gap-8">
            {d.list.map(b => (
              <div key={b.id} className="bg-white rounded-[3rem] p-8 border shadow-sm group hover:shadow-xl transition-all duration-700 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 aspect-square bg-gray-50 rounded-[2rem] overflow-hidden">
                  <img src={resolveServiceImageUrl(b.service)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-[#E8734A] uppercase tracking-widest">{b.service?.category}</p>
                      <h3 className="text-3xl font-serif">{b.service?.name}</h3>
                    </div>
                    <span className="px-4 py-2 bg-gray-100 rounded-xl text-[9px] font-bold uppercase">{b.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-[10px] font-bold uppercase text-gray-400">
                    <div><p>Schedule</p><p className="text-black text-sm mt-1">{new Date(b.booking_date).toLocaleDateString()}</p></div>
                    <div><p>Amount</p><p className="text-black text-sm mt-1">₱{parseFloat(b.total_amount).toLocaleString()}</p></div>
                  </div>
                  <div className="flex gap-4 pt-6 border-t">
                    {b.status === 'awaiting_payment' && <button onClick={() => nav('/client/checkout', { state: { booking: b } })} className="bg-[#E8734A] text-white px-8 py-4 rounded-xl text-[9px] font-bold uppercase">Pay Now</button>}
                    <button onClick={() => setD({ ...d, sel: b })} className="bg-[#1E293B] text-white px-8 py-4 rounded-xl text-[9px] font-bold uppercase">Receipt</button>
                    {(b.status === 'pending' || b.status === 'approved') && <button onClick={() => cancel(b.id)} className="text-red-500 text-[9px] font-bold uppercase">Cancel</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {d.sel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6" onClick={() => setD({ ...d, sel: null })}>
          <div className="bg-white p-12 rounded-[3rem] max-w-md w-full shadow-2xl animate-slideUp" onClick={e => e.stopPropagation()}>
            <h3 className="text-3xl font-serif mb-8 text-center">Manifest</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between"><span>Package</span><span className="font-bold">{d.sel.service?.name}</span></div>
              <div className="flex justify-between"><span>Investment</span><span className="font-bold">₱{parseFloat(d.sel.total_amount).toLocaleString()}</span></div>
              <div className="flex justify-between border-t pt-4 text-emerald-500"><span>Paid</span><span className="font-bold">₱{parseFloat(d.sel.paid_amount || 0).toLocaleString()}</span></div>
            </div>
            <button onClick={() => setD({ ...d, sel: null })} className="w-full bg-gray-100 mt-10 py-5 rounded-2xl text-[10px] font-bold uppercase">Close</button>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
