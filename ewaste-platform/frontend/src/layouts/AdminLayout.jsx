import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, UserCheck, Package, BarChart3, History, LogOut, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row selection:bg-purple-500 selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-slate-800 bg-purple-950/20">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">EcoRetrieve</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block -mt-1">Admin Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-sm font-medium">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive('/admin/dashboard') ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics & Overview
            </Link>

            <Link
              to="/admin/cases"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive('/admin/cases') ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Package className="w-4 h-4" />
              All Submitted Cases
            </Link>

            <Link
              to="/admin/users"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive('/admin/users') ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              User Accounts
            </Link>

            <Link
              to="/admin/agents"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive('/admin/agents') ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Field Agents
            </Link>

            <Link
              to="/admin/audit-logs"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive('/admin/audit-logs') ? 'bg-purple-950/80 text-purple-300 border border-purple-800/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              Security Audit Logs
            </Link>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">{user?.fullName}</span>
                <span className="text-[10px] text-purple-400 font-mono">Administrator</span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
