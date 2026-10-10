import React, { useState, useEffect } from 'react';
import { History, ShieldAlert, Lock, UserCheck } from 'lucide-react';
import api from '../../api/axios';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/audit-logs?limit=100');
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-xs">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Security Audit Log Trail</h1>
        <p className="text-slate-400">Chronological trail of administrative, authentication, and status change actions.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading security logs...</div>
      ) : (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Performed By</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/40">
                    <td className="p-4 text-slate-400 font-mono text-[11px]">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/50">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{log.performedByName || 'System'}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{log.performedByRole}</span>
                    </td>
                    <td className="p-4 font-mono text-emerald-400">{log.targetEntity} #{log.targetId ? log.targetId.substring(0, 8) : ''}</td>
                    <td className="p-4 text-slate-400 text-[11px] font-mono">
                      {JSON.stringify(log.details)}
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

export default AdminAuditLogsPage;
