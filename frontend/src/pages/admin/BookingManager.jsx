import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { bookingService } from '../../services/bookingService';

export default function BookingManager() {
  const [d, setD] = useState({ list: [], loading: true, err: '' });
  const [modal, setModal] = useState({ open: false, b: null, st: '' });

  useEffect(() => { fetch(); }, []);
  const fetch = async () => {
    try { const r = await bookingService.getAllBookings(); setD({ list: r.data || [], loading: false, err: '' }); }
    catch (e) { setD(p => ({ ...p, loading: false, err: 'Failed' })); }
  };

  const update = async (b, st, note = null) => {
    try {
      const res = await bookingService.updateBookingStatus(b.id, { status: st, admin_notes: note || b.admin_notes });
      setD(p => ({ ...p, list: p.list.map(i => i.id === b.id ? res.data : i) }));
      setModal({ open: false, b: null, st: '' });
    } catch (e) { setD(p => ({ ...p, err: 'Update Failed' })); }
  };

  if (d.loading) return <AdminLayout title="..."><div className="h-96 flex items-center justify-center animate-pulse">Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Sessions">
      <div className="space-y-8 animate-fadeIn">
        {d.err && <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs">{d.err}</div>}
        <div className="bg-white rounded-[2.5rem] shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <tr><th className="p-8">Client & Package</th><th className="p-8">Schedule</th><th className="p-8">Amount</th><th className="p-8 text-right">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {d.list.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#1E293B] text-white rounded-xl flex items-center justify-center font-serif">{b.user?.name?.[0]}</div>
                      <div><p className="font-bold text-sm">{b.user?.name}</p><p className="text-[9px] text-[#E8734A] font-bold uppercase">{b.service?.name}</p></div>
                    </div>
                  </td>
                  <td className="p-8"><p className="text-sm font-bold">{new Date(b.booking_date).toLocaleDateString()}</p><p className="text-[10px] text-gray-400 uppercase">{b.booking_time}</p></td>
                  <td className="p-8 font-bold">₱{parseFloat(b.total_amount).toLocaleString()}</td>
                  <td className="p-8 text-right">
                    <select value={b.status} onChange={e => update(b, e.target.value)} className="text-[9px] font-bold uppercase bg-gray-100 px-4 py-2 rounded-xl outline-none border-transparent focus:border-[#E8734A]">
                      {['pending','approved','awaiting_payment','paid','confirmed','rejected','finished','cancelled'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-serif mb-6">Decision Note</h3>
            <textarea id="adminNote" className="w-full bg-gray-50 p-6 rounded-2xl h-32 text-sm outline-none border focus:border-[#E8734A]" placeholder="Message for client..."></textarea>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setModal({open:false,b:null,st:''})} className="flex-1 py-4 border rounded-2xl text-[10px] font-bold uppercase">Cancel</button>
              <button onClick={() => update(modal.b, modal.st, document.getElementById('adminNote').value)} className="flex-1 py-4 bg-[#1E293B] text-white rounded-2xl text-[10px] font-bold uppercase">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
