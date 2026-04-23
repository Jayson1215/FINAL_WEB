import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import api from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, userId: null, userName: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true); setError('');
      let activeUsers = [], delUsers = [];
      try { const r = await api.get('/admin/users'); activeUsers = r.data || []; } catch(e){ throw new Error('Failed to load users'); }
      try { const r = await api.get('/admin/users/deleted'); delUsers = r.data || []; } catch(e){ delUsers = []; }
      setUsers(activeUsers); setDeletedUsers(delUsers);
    } catch(e){ setError(e.message); } finally { setLoading(false); }
  };

  const handleDeleteClick = (u) => setDeleteConfirm({ show: true, userId: u.id, userName: u.name });
  const confirmDelete = async () => { try { await api.post(`/admin/users/${deleteConfirm.userId}/delete`); setDeleteConfirm({show:false,userId:null,userName:''}); setError(''); await fetchData(); } catch(e){ setError('Failed to delete user'); } };
  const restoreUser = async (id) => { try { await api.post(`/admin/users/${id}/restore`); await fetchData(); } catch(e){ setError('Failed to restore'); } };
  const forceDeleteUser = async (id) => { if(!window.confirm('Permanently delete? Cannot be undone!')) return; try { await api.post(`/admin/users/${id}/force-delete`); await fetchData(); } catch(e){ setError('Failed to permanently delete'); } };

  if(loading&&users.length===0&&deletedUsers.length===0) return (
    <AdminLayout title="System Users">
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin mx-auto"></div>
        <p className="text-[10px] font-bold text-black uppercase tracking-widest">Scanning Records...</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="System Users">
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 uppercase tracking-widest">{error}</div>}

      {/* Delete Modal - High Contrast */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[500] px-4 animate-fadeIn">
          <div className="bg-white p-12 max-w-sm w-full shadow-2xl border border-black/10 rounded-[2.5rem] animate-slideUp text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
              <span className="text-3xl">👤</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-tight">Deactivate Profile</h3>
            <p className="text-[11px] text-black opacity-40 font-bold uppercase tracking-widest mb-10">Archive <strong className="text-black underline">{deleteConfirm.userName}</strong>?</p>
            <div className="flex gap-4">
              <button onClick={()=>setDeleteConfirm({show:false,userId:null,userName:''})} className="flex-1 px-4 py-4 bg-slate-50 text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl border border-black/5 hover:bg-slate-100 transition">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-red-600 transition shadow-lg">Confirm Action</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-10 animate-fadeIn">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-black uppercase tracking-widest">Personnel Directory</h2>
            <p className="text-[10px] font-bold text-black opacity-40 uppercase tracking-[0.2em] mt-1">Management of studio clientele and staff</p>
          </div>
          {/* Tabs - Modern Light Style */}
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-black/5">
            <button onClick={()=>setActiveTab('active')} className={`px-6 py-2 text-[9px] font-bold uppercase tracking-[0.15em] rounded-lg transition-all ${activeTab==='active'?'bg-white text-black shadow-sm border border-black/5':'text-black opacity-40 hover:opacity-100'}`}>Active ({users.length})</button>
            <button onClick={()=>setActiveTab('deleted')} className={`px-6 py-2 text-[9px] font-bold uppercase tracking-[0.15em] rounded-lg transition-all ${activeTab==='deleted'?'bg-white text-black shadow-sm border border-black/5':'text-black opacity-40 hover:opacity-100'}`}>Archived ({deletedUsers.length})</button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab==='active' ? (
              users.length===0 ? (<div className="py-20 text-center text-[10px] font-bold text-black opacity-40 uppercase tracking-widest italic">No active personnel records.</div>) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-black/20">
                      {['User Persona', 'Secure Email', 'Privileges', 'Registration', 'System Actions'].map((h, i)=>(
                        <th key={h} className={`px-8 py-5 text-[9px] font-bold text-black uppercase tracking-[0.25em] ${i < 4 ? 'border-r border-black/10' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 bg-white">
                    {users.map(u=>(
                      <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 border-r border-black/5">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm font-bold text-black">{u.name}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[11px] font-medium text-black border-r border-black/5">{u.email}</td>
                        <td className="px-8 py-6 border-r border-black/5">
                          <span className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-md border ${u.role==='admin'?'bg-black text-white border-black':'bg-slate-50 text-black border-black/10'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-[10px] font-bold text-black opacity-60 tracking-widest border-r border-black/5">
                          {new Date(u.created_at).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={()=>handleDeleteClick(u)} className="text-[9px] font-bold text-black opacity-40 hover:text-red-600 hover:opacity-100 transition-all uppercase tracking-widest px-4 py-2 bg-slate-50 border border-black/5 rounded-lg">Deactivate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              deletedUsers.length===0 ? (<div className="py-20 text-center text-[10px] font-bold text-black opacity-40 uppercase tracking-widest italic">Archive is currently empty.</div>) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-red-50/30 border-b border-black/20">
                      {['Archived User', 'Secure Email', 'Archival Date', 'System Recovery'].map((h, i)=>(
                        <th key={h} className={`px-8 py-5 text-[9px] font-bold text-black uppercase tracking-[0.25em] ${i < 3 ? 'border-r border-black/10' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 bg-white">
                    {deletedUsers.map(u=>(
                      <tr key={u.id} className="group hover:bg-red-50/20 transition-colors italic opacity-60">
                        <td className="px-8 py-6 border-r border-black/5">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center text-black/40 text-[11px] font-bold shadow-sm">
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-sm font-bold text-black line-through">{u.name}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[11px] font-medium text-black line-through border-r border-black/5">{u.email}</td>
                        <td className="px-8 py-6 text-[10px] font-bold text-black tracking-widest border-r border-black/5">
                          {new Date(u.deleted_at).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={()=>restoreUser(u.id)} className="text-[9px] font-bold text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg border border-green-100 transition-all uppercase tracking-widest">Restore</button>
                            <button onClick={()=>forceDeleteUser(u.id)} className="text-[9px] font-bold text-black opacity-40 hover:text-red-600 px-3 py-2 rounded-lg border border-black/5 transition-all uppercase tracking-widest">Purge</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
