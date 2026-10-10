import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle2, Truck, PlusCircle, ArrowRight, ShieldAlert, Sparkles, Leaf, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const UserDashboard = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCases();
  }, []);

  const fetchMyCases = async () => {
    try {
      const res = await api.get('/cases/my?limit=5');
      if (res.data.success) {
        setCases(res.data.cases);
      }
    } catch (err) {
      console.error('Failed to load user cases:', err);
    } finally {
      setLoading(false);
    }
  };

  // Metrics calculation
  const totalCases = cases.length;
  const pendingCases = cases.filter((c) => ['Submitted', 'Under Review', 'Agent Assigned', 'Needs More Information'].includes(c.status)).length;
  const approvedCases = cases.filter((c) => ['Assessment Confirmed'].includes(c.status)).length;
  const inCollectionCases = cases.filter((c) => ['Awaiting Collection', 'Collected', 'Repair / Refurbishment / Recycling'].includes(c.status)).length;
  const completedCases = cases.filter((c) => c.status === 'Completed').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Submitted':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">Submitted</span>;
      case 'Under Review':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800/40">Under Review</span>;
      case 'Agent Assigned':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800/40">Agent Assigned</span>;
      case 'Assessment Confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40">Assessment Confirmed</span>;
      case 'Awaiting Collection':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/40">Awaiting Collection</span>;
      case 'Collected':
      case 'Repair / Refurbishment / Recycling':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-lime-950 text-lime-300 border border-lime-800/40">In Recycling</span>;
      case 'Completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-600 text-white shadow-sm">Completed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-medium border border-emerald-700/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Circular Recovery Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Track your e-waste submissions, review assessment reports, and request pickup.
          </p>
        </div>

        <Link
          to="/submit-ewaste"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Submit E-Waste Item
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Submitted</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold text-white block">{totalCases}</span>
          <span className="text-[10px] text-slate-500">Total products</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-amber-400 text-xs">
            <span>Pending Review</span>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-white block">{pendingCases}</span>
          <span className="text-[10px] text-slate-500">Awaiting inspection</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 text-xs">
            <span>Approved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-white block">{approvedCases}</span>
          <span className="text-[10px] text-slate-500">Confirmed cases</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-blue-400 text-xs">
            <span>In Collection</span>
            <Truck className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-white block">{inCollectionCases}</span>
          <span className="text-[10px] text-slate-500">Pickup / Recycling</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-lime-400 text-xs">
            <span>Completed</span>
            <Leaf className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold text-white block">{completedCases}</span>
          <span className="text-[10px] text-slate-500">Fully recovered</span>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent E-Waste Submissions</h2>
          <Link to="/my-cases" className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1">
            View All ({cases.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-500 text-xs">Loading submission records...</div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
            <Package className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-xs">No e-waste items submitted yet.</p>
            <Link
              to="/submit-ewaste"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Submit Your First Item
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <div
                key={c._id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-emerald-400 font-bold">{c.caseReference}</span>
                    {getStatusBadge(c.status)}
                  </div>
                  <h3 className="text-sm font-bold text-white">{c.productName}</h3>
                  <p className="text-xs text-slate-400">
                    Category: <span className="capitalize text-slate-300">{c.category}</span> • Condition: <span className="capitalize text-slate-300">{c.physicalCondition}</span>
                  </p>
                </div>

                <Link
                  to={`/my-cases/${c._id}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disposal Tips Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4 text-xs">
        <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 shrink-0">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm">Did you know?</h4>
          <p className="text-slate-400 leading-relaxed">
            Recycling 1 million laptops saves the energy equivalent to the electricity used by 3,500 US homes in a year. Before handing over smartphones or PCs, make sure to execute a full factory reset.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
