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

  if(loading&&users.length===0&&deletedUsers.length===0) return (<AdminLayout title="Manage Users"><div className="flex justify-center items-center h-96"><div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#6366F1] rounded-full animate-spin mx-auto"></div></div></AdminLayout>);

  return (
    <AdminLayout title="User Management">
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

      {/* Delete Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 max-w-sm w-full shadow-2xl border border-[#E2E8F0] rounded-2xl animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><span className="text-2xl">👤</span></div>
              <h3 className="text-xl font-bold text-[#1E293B]">Deactivate User?</h3>
            </div>
            <p className="text-sm text-[#64748B] text-center mb-6">Suspend <strong className="text-[#1E293B]">{deleteConfirm.userName}</strong>? Their profile will be archived.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDeleteConfirm({show:false,userId:null,userName:''})} className="flex-1 px-4 py-3 bg-[#F0F2F5] text-[#1E293B] text-sm font-semibold rounded-xl hover:bg-[#E2E8F0] transition">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition">Deactivate</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 animate-fadeIn">
        <div><h2 className="text-2xl font-bold text-[#1E293B] mb-1">User Management</h2><p className="text-sm text-[#94A3B8]">Manage your studio's clientele and staff.</p></div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#F0F2F5] p-1 rounded-xl w-fit">
          <button onClick={()=>setActiveTab('active')} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-all ${activeTab==='active'?'bg-white text-[#1E293B] shadow-sm':'text-[#94A3B8] hover:text-[#64748B]'}`}>Active ({users.length})</button>
          <button onClick={()=>setActiveTab('deleted')} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-all ${activeTab==='deleted'?'bg-white text-[#1E293B] shadow-sm':'text-[#94A3B8] hover:text-[#64748B]'}`}>Archived ({deletedUsers.length})</button>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-[#F1F5F9] overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab==='active' ? (
              users.length===0 ? (<div className="py-16 text-center text-sm text-[#94A3B8]">No active users</div>) : (
                <table className="w-full text-left">
                  <thead className="bg-[#F8F9FB]"><tr>
                    {['User','Email','Role','Joined','Actions'].map(h=>(<th key={h} className={`px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] ${h==='Actions'?'text-right':''}`}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {users.map(u=>(
                      <tr key={u.id} className="border-b border-[#F8F9FB] hover:bg-[#FAFBFC] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</div>
                            <p className="text-sm font-semibold text-[#1E293B]">{u.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#64748B]">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg ${u.role==='admin'?'bg-[#1E293B] text-white':'bg-[#F0F2F5] text-[#64748B]'}`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#94A3B8]">{new Date(u.created_at).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={()=>handleDeleteClick(u)} className="text-[10px] font-semibold text-[#94A3B8] hover:text-red-500 transition">Deactivate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              deletedUsers.length===0 ? (<div className="py-16 text-center text-sm text-[#94A3B8]">No archived users</div>) : (
                <table className="w-full text-left">
                  <thead className="bg-[#FEF2F2]"><tr>
                    {['User','Email','Archived','Actions'].map(h=>(<th key={h} className={`px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8] ${h==='Actions'?'text-right':''}`}>{h}</th>))}
                  </tr></thead>
                  <tbody>
                    {deletedUsers.map(u=>(
                      <tr key={u.id} className="border-b border-[#F8F9FB] hover:bg-red-50/50 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#94A3B8] text-xs font-bold">{u.name?.charAt(0).toUpperCase()}</div><p className="text-sm text-[#94A3B8] line-through">{u.name}</p></div></td>
                        <td className="px-6 py-4 text-sm text-[#94A3B8] line-through">{u.email}</td>
                        <td className="px-6 py-4 text-xs text-[#94A3B8]">{new Date(u.deleted_at).toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-4">
                            <button onClick={()=>restoreUser(u.id)} className="text-[10px] font-semibold text-[#10B981] hover:underline">Restore</button>
                            <button onClick={()=>forceDeleteUser(u.id)} className="text-[10px] font-semibold text-[#94A3B8] hover:text-red-500 transition">Purge</button>
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
