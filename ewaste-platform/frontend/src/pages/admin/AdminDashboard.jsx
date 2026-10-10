import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Package, CheckCircle2, Download, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import api from '../../api/axios';

const COLORS = ['#10B981', '#84CC16', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await api.get('/admin/export-cases', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ewaste_cases_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('CSV Export failed.');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500 text-xs">Loading analytics dashboard data...</div>;
  }

  const categoryData = analytics?.categoryDistribution || [];
  const statusDist = analytics?.statusDistribution || {};
  const statusData = Object.keys(statusDist).map((key) => ({ name: key, count: statusDist[key] }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">System Analytics & Executive Overview</h1>
          <p className="text-xs text-slate-400">Aggregate platform metrics, category distribution, and recovery trends.</p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/50 transition-all"
        >
          <Download className="w-4 h-4" />
          Export Cases to CSV
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-purple-400 text-xs">
            <span>Total Submissions</span>
            <Package className="w-4 h-4" />
          </div>
          <span className="text-3xl font-bold text-white block">{analytics?.totalCases || 0}</span>
          <span className="text-[10px] text-slate-500">Master cases recorded</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-amber-400 text-xs">
            <span>Pending Workflow</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-3xl font-bold text-white block">{analytics?.pendingCases || 0}</span>
          <span className="text-[10px] text-slate-500">Active in pipeline</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 text-xs">
            <span>Completed Recovery</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-3xl font-bold text-white block">{analytics?.completedCases || 0}</span>
          <span className="text-[10px] text-slate-500">100% recycled or restored</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-blue-400 text-xs">
            <span>Active Users & Agents</span>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-3xl font-bold text-white block">{(analytics?.totalUsers || 0) + (analytics?.totalAgents || 0)}</span>
          <span className="text-[10px] text-slate-500">{analytics?.totalUsers} Customers, {analytics?.totalAgents} Agents</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">E-Waste Category Breakdown</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ category, count }) => `${category} (${count})`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Case Status Distribution Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Workflow Status Distribution</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
