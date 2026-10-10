import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, PlusCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

const MyCasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      let query = `/cases/my?limit=50`;
      if (statusFilter) query += `&status=${encodeURIComponent(statusFilter)}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;

      const res = await api.get(query);
      if (res.data.success) {
        setCases(res.data.cases);
      }
    } catch (err) {
      console.error('Failed to fetch cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCases();
  };

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
      case 'Cancelled':
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800/40">{status}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Submitted Products</h1>
          <p className="text-xs text-slate-400">Track and manage your submitted e-waste recovery cases.</p>
        </div>

        <Link
          to="/submit-ewaste"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Submit New Item
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case reference or product name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Agent Assigned">Agent Assigned</option>
            <option value="Assessment Confirmed">Assessment Confirmed</option>
            <option value="Awaiting Collection">Awaiting Collection</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Case Records List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 text-xs">Loading case records...</div>
      ) : cases.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-xs">No matching e-waste cases found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <div
              key={c._id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-emerald-400 font-bold">{c.caseReference}</span>
                  {getStatusBadge(c.status)}
                  <span className="text-[10px] text-slate-500">• {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold text-white">{c.productName}</h3>
                <p className="text-xs text-slate-400">
                  Category: <span className="capitalize text-slate-300">{c.category}</span> | Age: <span className="text-slate-300">{c.approxAge}</span> | Pickup: <span className="text-slate-300">{c.pickupAddress || 'N/A'}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Link
                  to={`/my-cases/${c._id}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  Details & Timeline
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCasesPage;
