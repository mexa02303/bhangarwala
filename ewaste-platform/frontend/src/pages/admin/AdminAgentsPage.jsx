import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, AlertCircle, CheckCircle2, Loader2, ShieldCheck, Mail, Lock, User, Phone } from 'lucide-react';
import api from '../../api/axios';

const AdminAgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for Creating Agent
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    phone: ''
  });

  const [formMsg, setFormMsg] = useState({ type: '', text: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/agents');
      if (res.data.success) {
        setAgents(res.data.agents);
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    setCreating(true);

    try {
      const res = await api.post('/admin/agents', formData);
      if (res.data.success) {
        setFormMsg({ type: 'success', text: `Agent account created for ${res.data.agent.fullName}` });
        fetchAgents();
        setTimeout(() => {
          setShowCreateModal(false);
          setFormData({ fullName: '', email: '', username: '', password: '', phone: '' });
          setFormMsg({ type: '', text: '' });
        }, 1200);
      }
    } catch (err) {
      setFormMsg({ type: 'error', text: err.message || 'Agent creation failed' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Field Agent Roster</h1>
          <p className="text-slate-400">Manage field recycling agents responsible for case inspection and pickup.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-950/50"
        >
          <Plus className="w-4 h-4" />
          Create New Field Agent
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading agent roster...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((ag) => (
            <div key={ag._id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center font-bold text-lg">
                  {ag.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{ag.fullName}</h3>
                  <span className="font-mono text-purple-400 text-[11px]">@{ag.username}</span>
                </div>
              </div>

              <div className="space-y-1 text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                <p>Email: <span className="text-slate-200">{ag.email}</span></p>
                <p>Phone: <span className="text-slate-200">{ag.phone || 'N/A'}</span></p>
                <p>Role: <span className="text-blue-400 font-bold">Field Recovery Agent</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Field Agent Account</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {formMsg.text && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                formMsg.type === 'success' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-red-950 border border-red-800 text-red-300'
              }`}>
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Agent Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="agent.sarah@ewaste.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Username *</label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="agent_sarah"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Initial Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2831"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgentsPage;
