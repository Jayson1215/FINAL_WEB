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
    <AdminLayout title="Manage Users">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-5xl block mb-4">🗑️</span>
              <h3 className="text-2xl font-bold text-slate-900">Delete User?</h3>
            </div>
            <p className="text-slate-600 text-center mb-8">
              Are you sure you want to delete <strong className="text-slate-900">{deleteConfirm.userName}</strong>? They can be restored from the deleted users tab.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, userId: null, userName: '' })}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-purple-600 text-sm font-semibold uppercase tracking-widest">User Administration</p>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Manage Users</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-4 px-2 font-semibold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'active'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('deleted')}
            className={`pb-4 px-2 font-semibold text-sm uppercase tracking-wider transition-all ${
              activeTab === 'deleted'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Deleted/Blacklisted ({deletedUsers.length})
          </button>
        </div>

        {/* Active Users Table */}
        {activeTab === 'active' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            {users.length === 0 ? (
              <div className="py-12 text-center">
                <span className="text-4xl mb-3 block">👥</span>
                <p className="text-slate-600 font-medium">No active users</p>
                <p className="text-slate-500 text-sm mt-2">Users will appear here once they register</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              user.role === 'admin'
                                ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                                : 'bg-gradient-to-br from-purple-300 to-purple-500'
                            }`}>
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-600 text-sm">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Deleted Users Table */}
        {activeTab === 'deleted' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            {deletedUsers.length === 0 ? (
              <div className="py-12 text-center">
                <span className="text-4xl mb-3 block">✓</span>
                <p className="text-slate-600 font-medium">No deleted users</p>
                <p className="text-slate-500 text-sm mt-2">All users are active and in good standing</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-red-50 to-red-100 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">Deleted</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-red-900 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {deletedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-red-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm line-through">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-semibold text-slate-700 line-through">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-600 text-sm">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase opacity-60 ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(user.deleted_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => restoreUser(user.id)}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => forceDeleteUser(user.id)}
                              className="px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold transition"
                            >
                              Permanent Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
