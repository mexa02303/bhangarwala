import React, { useState, useEffect } from 'react';
import { Users, Search, ToggleLeft, ToggleRight, ShieldCheck, UserX } from 'lucide-react';
import api from '../../api/axios';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = `/admin/users?limit=100`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(query);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle account status');
    }
  };

  return (
    <div className="space-y-8 text-xs">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Registered User Accounts</h1>
        <p className="text-slate-400">View user profiles and manage active/deactivated account access.</p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            placeholder="Search by name, email, or username..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading user accounts...</div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white">{u.fullName}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4 font-mono text-purple-400">{u.username}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800/60' : u.role === 'agent' ? 'bg-blue-950 text-blue-300 border border-blue-800/60' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      {u.role === 'admin' ? (
                        <span className="text-[10px] text-purple-400 font-bold">Admin Active</span>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                            u.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900' : 'bg-red-950 text-red-300 border border-red-800/50 hover:bg-red-900'
                          }`}
                        >
                          {u.isActive ? 'Active (Click to Deactivate)' : 'Inactive (Click to Activate)'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
