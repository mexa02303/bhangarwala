import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, UserCheck, MessageSquare, ArrowRight, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import api from '../../api/axios';

const STATUS_OPTIONS = [
  'Submitted',
  'Under Review',
  'Agent Assigned',
  'Assessment Confirmed',
  'Awaiting Collection',
  'Collected',
  'Repair / Refurbishment / Recycling',
  'Completed',
  'Rejected',
  'Cancelled',
  'Needs More Information'
];

const AdminCasesPage = () => {
  const [cases, setCases] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Case Modal State
  const [selectedCase, setSelectedCase] = useState(null);
  const [assignAgentId, setAssignAgentId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    fetchCases();
    fetchAgents();
  }, [statusFilter]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      let query = `/cases?limit=100`;
      if (statusFilter) query += `&status=${encodeURIComponent(statusFilter)}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(query);
      if (res.data.success) {
        setCases(res.data.cases);
      }
    } catch (err) {
      console.error('Failed to fetch admin cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get('/admin/agents');
      if (res.data.success) {
        setAgents(res.data.agents);
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    }
  };

  const handleAssignAgent = async (caseId) => {
    if (!assignAgentId) return;
    try {
      const res = await api.post(`/cases/${caseId}/assign`, { agentId: assignAgentId });
      if (res.data.success) {
        setActionMsg('Agent assigned successfully!');
        fetchCases();
        setSelectedCase(res.data.case);
      }
    } catch (err) {
      alert(err.message || 'Agent assignment failed');
    }
  };

  const handleUpdateStatus = async (caseId) => {
    if (!newStatus) return;
    try {
      const res = await api.post(`/cases/${caseId}/status`, {
        status: newStatus,
        reasonOrNotes: statusReason
      });
      if (res.data.success) {
        setActionMsg(`Status updated to '${newStatus}'`);
        fetchCases();
        setSelectedCase(res.data.case);
      }
    } catch (err) {
      alert(err.message || 'Status transition failed');
    }
  };

  const handleAddNote = async (caseId) => {
    if (!noteContent.trim()) return;
    try {
      const res = await api.post(`/cases/${caseId}/notes`, {
        note: noteContent,
        isInternal: isInternalNote
      });
      if (res.data.success) {
        setActionMsg('Note recorded.');
        setNoteContent('');
        setSelectedCase(res.data.case);
      }
    } catch (err) {
      alert(err.message || 'Failed to add note');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Master Case Management</h1>
        <p className="text-xs text-slate-400">View, assign agents, and manage workflow transitions for all e-waste submissions.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCases()}
            placeholder="Search reference, product, brand, or user..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Case Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading master cases...</div>
      ) : cases.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2 text-slate-400 text-xs">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <p>No matching e-waste cases found.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="p-4">Reference</th>
                  <th className="p-4">Product & Category</th>
                  <th className="p-4">Submitted By</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Agent</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {cases.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-purple-400">{c.caseReference}</td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{c.productName}</span>
                      <span className="text-[10px] text-slate-500 capitalize">{c.category} • {c.physicalCondition}</span>
                    </td>
                    <td className="p-4">
                      <span className="block text-slate-200">{c.userId?.fullName || 'User'}</span>
                      <span className="text-[10px] text-slate-500">{c.userId?.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800/50">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {c.assignedAgentId ? (
                        <span className="text-emerald-400 font-medium">{c.assignedAgentId.fullName}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedCase(c);
                          setNewStatus(c.status);
                          setAssignAgentId(c.assignedAgentId?._id || '');
                          setActionMsg('');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] transition-colors"
                      >
                        Manage Case
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Case Management Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-purple-400 font-bold block">{selectedCase.caseReference}</span>
                <h3 className="text-lg font-bold text-white">{selectedCase.productName}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs">
                {actionMsg}
              </div>
            )}

            {/* 1. Assign Agent */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-400" />
                Assign / Reassign Field Agent
              </h4>
              <div className="flex gap-2">
                <select
                  value={assignAgentId}
                  onChange={(e) => setAssignAgentId(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select Field Agent</option>
                  {agents.map((ag) => (
                    <option key={ag._id} value={ag._id}>
                      {ag.fullName} ({ag.email})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssignAgent(selectedCase._id)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0"
                >
                  Assign Agent
                </button>
              </div>
            </div>

            {/* 2. Change Status Workflow */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white">Workflow Status Transition</h4>
              <div className="space-y-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="Reason or transition note (optional)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedCase._id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm Workflow Transition
                </button>
              </div>
            </div>

            {/* 3. Add Internal or Public Note */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Add Staff Note
              </h4>
              <textarea
                rows={2}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write inspection or admin notes here..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-purple-600"
                  />
                  <span>Internal Staff Only (Hide from Customer)</span>
                </label>
                <button
                  onClick={() => handleAddNote(selectedCase._id)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCasesPage;
