import React, { useState, useEffect } from 'react';
import { Truck, ClipboardList, CheckCircle2, AlertTriangle, ArrowRight, MessageSquare, Save, X, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const AgentDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  // Inspection Findings Form State
  const [findings, setFindings] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('recycling');
  const [status, setStatus] = useState('');
  const [noteText, setNoteText] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAgentCases();
  }, []);

  const fetchAgentCases = async () => {
    setLoading(true);
    try {
      const res = await api.get('/agent/cases');
      if (res.data.success) {
        setCases(res.data.cases);
      }
    } catch (err) {
      console.error('Failed to fetch agent cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInspection = async (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    setSaving(true);
    setActionMsg('');

    try {
      // 1. Update Inspection Findings
      await api.post(`/cases/${selectedCase._id}/inspection`, {
        inspectionFindings: findings,
        recommendedAction
      });

      // 2. Update Status if changed
      if (status && status !== selectedCase.status) {
        await api.post(`/cases/${selectedCase._id}/status`, {
          status,
          reasonOrNotes: `Updated by Field Agent: ${findings}`
        });
      }

      // 3. Add Agent Note if provided
      if (noteText.trim()) {
        await api.post(`/cases/${selectedCase._id}/notes`, {
          note: noteText,
          isInternal: false
        });
      }

      setActionMsg('Inspection findings & status updated successfully!');
      fetchAgentCases();
      setTimeout(() => setSelectedCase(null), 1000);
    } catch (err) {
      alert(err.message || 'Inspection update failed');
    } finally {
      setSaving(false);
    }
  };

  const openInspectionModal = (c) => {
    setSelectedCase(c);
    setFindings(c.inspectionFindings || '');
    setRecommendedAction(c.recommendedAction || 'recycling');
    setStatus(c.status);
    setNoteText('');
    setActionMsg('');
  };

  const assignedCount = cases.length;
  const inProgressCount = cases.filter((c) => ['Agent Assigned', 'Assessment Confirmed', 'Awaiting Collection', 'Collected', 'Repair / Refurbishment / Recycling'].includes(c.status)).length;
  const completedCount = cases.filter((c) => c.status === 'Completed').length;

  return (
    <div className="space-y-8 text-xs">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Field Agent Worklist</h1>
        <p className="text-slate-400">Perform physical device inspection, record component findings, and update recovery status.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-semibold block">Total Assigned Cases</span>
          <span className="text-3xl font-extrabold text-blue-400">{assignedCount}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-semibold block">Active In Progress</span>
          <span className="text-3xl font-extrabold text-amber-400">{inProgressCount}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-semibold block">Work Completed</span>
          <span className="text-3xl font-extrabold text-emerald-400">{completedCount}</span>
        </div>
      </div>

      {/* Assigned Cases List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading assigned cases...</div>
      ) : cases.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2 text-slate-400">
          <Truck className="w-10 h-10 text-slate-600 mx-auto" />
          <p>No cases currently assigned to your roster.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <div
              key={c._id}
              className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-400">{c.caseReference}</span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800/50">
                    {c.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{c.productName}</h3>
                <p className="text-slate-400">
                  Customer: <span className="text-slate-200">{c.userId?.fullName} ({c.userId?.phone || c.userId?.email})</span> • Pickup Address: <span className="text-slate-200">{c.pickupAddress || 'N/A'}</span>
                </p>
                {c.inspectionFindings && (
                  <p className="text-[11px] text-amber-300 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                    Inspection: "{c.inspectionFindings}" (Action: {c.recommendedAction})
                  </p>
                )}
              </div>

              <button
                onClick={() => openInspectionModal(c)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shrink-0"
              >
                Inspect & Update
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Agent Inspection Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-blue-400 font-bold block">{selectedCase.caseReference}</span>
                <h3 className="text-base font-bold text-white">{selectedCase.productName}</h3>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionMsg && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300">
                {actionMsg}
              </div>
            )}

            <form onSubmit={handleUpdateInspection} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Update Status Workflow</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Agent Assigned">Agent Assigned</option>
                  <option value="Assessment Confirmed">Assessment Confirmed</option>
                  <option value="Awaiting Collection">Awaiting Collection</option>
                  <option value="Collected">Collected (Device picked up)</option>
                  <option value="Repair / Refurbishment / Recycling">Repair / Refurbishment / Recycling</option>
                  <option value="Completed">Completed (Work finished)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Recommended Action</label>
                <select
                  value={recommendedAction}
                  onChange={(e) => setRecommendedAction(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="repair">Repair and Reuse</option>
                  <option value="refurbishment">Refurbishment</option>
                  <option value="component recovery">Component Salvage</option>
                  <option value="recycling">Certified Recycling</option>
                  <option value="specialist inspection">Specialist Hazmat Inspection</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Physical Inspection Findings</label>
                <textarea
                  rows={3}
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  placeholder="Record screen condition, battery health, missing components, or test results..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Add Customer-Visible Note (Optional)</label>
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Pickup scheduled for Tuesday 10:00 AM..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Inspection Findings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
