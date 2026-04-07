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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch active users
      let activeUsers = [];
      try {
        const activeRes = await api.get('/admin/users');
        activeUsers = activeRes.data || [];
      } catch (err) {
        console.error('Error fetching active users:', err);
        throw new Error('Failed to load active users: ' + (err.response?.data?.message || err.message));
      }

      // Fetch deleted users
      let deletedUsers = [];
      try {
        const deletedRes = await api.get('/admin/users/deleted');
        deletedUsers = deletedRes.data || [];
      } catch (err) {
        console.error('Error fetching deleted users:', err);
        // Don't fail if deleted users can't load - it might just be no deleted users
        deletedUsers = [];
      }

      setUsers(activeUsers);
      setDeletedUsers(deletedUsers);
    } catch (err) {
      console.error('Full error:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteConfirm({ show: true, userId: user.id, userName: user.name });
  };

  const confirmDelete = async () => {
    try {
      await api.post(`/admin/users/${deleteConfirm.userId}/delete`);
      setDeleteConfirm({ show: false, userId: null, userName: '' });
      setError('');
      await fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const restoreUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/restore`);
      setError('');
      await fetchData();
    } catch (err) {
      console.error('Restore error:', err);
      setError(err.response?.data?.message || 'Failed to restore user');
    }
  };

  const forceDeleteUser = async (userId) => {
    if (!window.confirm('This will permanently delete the user. This action cannot be undone!')) {
      return;
    }
    try {
      await api.post(`/admin/users/${userId}/force-delete`);
      setError('');
      await fetchData();
    } catch (err) {
      console.error('Force delete error:', err);
      setError(err.response?.data?.message || 'Failed to permanently delete user');
    }
  };

  if (loading && users.length === 0 && deletedUsers.length === 0) {
    return (
      <AdminLayout title="Manage Users">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Studio Directory">
      {error && (
        <div className="mb-10 p-6 bg-red-50 border-l-2 border-red-200">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 mb-2">Notice</p>
          <p className="text-sm text-red-800 font-serif italic">{error}</p>
        </div>
      )}

      {/* Delete Confirmation Modal - Luxury Styled */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-10 max-w-sm w-full shadow-2xl border border-[#EEEEEE] animate-fadeIn">
            <div className="text-center mb-8">
              <span className="text-4xl block mb-6 grayscale opacity-50">👤</span>
              <h3 className="text-2xl font-serif text-[#1A1A1A]">Deactivate Access?</h3>
            </div>
            <p className="text-[11px] text-[#777] text-center mb-10 leading-relaxed tracking-wide">
              Are you sure you want to suspend <strong className="text-[#1A1A1A] font-bold">{deleteConfirm.userName}</strong>? Their profile will be archived.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm({ show: false, userId: null, userName: '' })}
                className="flex-1 px-4 py-4 border border-[#EEEEEE] text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-[#F9F9F9] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-4 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-red-600 transition-all font-semibold"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-16 animate-fadeIn">
        {/* Editorial Header */}
        <div className="border-b border-[#EEEEEE] pb-10">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-tight mb-4">User Management</h2>
          <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C79F68]">Overseeing the registry of your studio's clientele and staff.</p>
        </div>

        {/* Tabs - Minimalist with Gold Accent */}
        <div className="flex gap-12 border-b border-[#EEEEEE]">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${
              activeTab === 'active'
                ? 'text-[#1A1A1A]'
                : 'text-[#BBB] hover:text-[#777]'
            }`}
          >
            Active Directory ({users.length})
            {activeTab === 'active' && <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C79F68]"></span>}
          </button>
          <button
            onClick={() => setActiveTab('deleted')}
            className={`pb-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative ${
              activeTab === 'deleted'
                ? 'text-[#1A1A1A]'
                : 'text-[#BBB] hover:text-[#777]'
            }`}
          >
            Archived Registry ({deletedUsers.length})
            {activeTab === 'deleted' && <span className="absolute bottom-0 left-0 right-0 h-px bg-red-600"></span>}
          </button>
        </div>

        {/* User Content */}
        <div className="overflow-x-auto">
          {activeTab === 'active' ? (
            users.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-[#EEEEEE]">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#BBB]">The directory is currently empty</p>
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Identify</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Contact</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Privilege</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A]">Joined Date</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-[#1A1A1A] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {users.map((user) => (
                    <tr key={user.id} className="group hover:bg-[#FAFAFA] transition-all duration-500">
                      <td className="py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 border border-[#EEEEEE] flex items-center justify-center text-[#999] text-xs font-serif group-hover:border-[#C79F68] group-hover:text-[#C79F68] transition-all duration-700">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm font-serif text-[#1A1A1A]">{user.name}</p>
                        </div>
                      </td>
                      <td className="py-8">
                        <p className="text-[11px] text-[#777] tracking-widest lowercase">{user.email}</p>
                      </td>
                      <td className="py-8">
                        <span className={`text-[8px] font-bold uppercase tracking-[0.4em] px-3 py-1.5 border ${
                          user.role === 'admin'
                            ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                            : 'bg-white text-[#777] border-[#EEEEEE]'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-8 text-[11px] text-[#AAA] tracking-widest">
                        {new Date(user.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-8 text-right">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#BBB] hover:text-red-600 transition-colors"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            deletedUsers.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-[#EEEEEE]">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#BBB]">Registry is pristine</p>
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-red-600">Identify</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-red-600">Contact</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-red-600">Archived</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#333] border-b border-red-600 text-right">Restoration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5]">
                  {deletedUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-red-50 transition-all duration-500">
                      <td className="py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-[#F9F9F9] border border-[#EEEEEE] flex items-center justify-center text-[#DDD] text-xs font-serif line-through">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-sm font-serif text-[#999] line-through">{user.name}</p>
                        </div>
                      </td>
                      <td className="py-8">
                        <p className="text-[11px] text-[#BBB] tracking-widest line-through lowercase">{user.email}</p>
                      </td>
                      <td className="py-8 text-[11px] text-[#BBB] tracking-widest">
                        {new Date(user.deleted_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-8 text-right">
                        <div className="flex justify-end gap-6">
                          <button
                            onClick={() => restoreUser(user.id)}
                            className="text-[9px] font-bold uppercase tracking-[0.3em] text-green-600 hover:opacity-70 transition-colors"
                          >
                            Reactivate
                          </button>
                          <button
                            onClick={() => forceDeleteUser(user.id)}
                            className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#BBB] hover:text-red-700 transition-colors"
                          >
                            Purge
                          </button>
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
    </AdminLayout>
  );
}
