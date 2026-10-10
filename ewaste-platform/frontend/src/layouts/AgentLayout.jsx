import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Truck, ClipboardList, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AgentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Agent Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/agent/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">EcoRetrieve</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 block -mt-1">Field Agent Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link
              to="/agent/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/agent/dashboard') ? 'bg-blue-950/80 text-blue-400 border border-blue-800/40' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Assigned Worklist
            </Link>
          </nav>

          {/* Agent Info & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="font-semibold text-slate-200">{user?.fullName}</span>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;
