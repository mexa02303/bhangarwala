import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Recycle, LayoutDashboard, PlusCircle, PackageCheck, User, LogOut, Bot, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EcoGuideChatbot from '../components/EcoGuideChatbot';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* User Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">EcoRetrieve</span>
              <span className="text-[10px] block text-emerald-400 font-medium -mt-1">Customer Portal</span>
            </div>
          </Link>

          {/* User Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/dashboard') ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/submit-ewaste"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/submit-ewaste') ? 'bg-emerald-600 text-white' : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/30'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Submit E-Waste
            </Link>
            <Link
              to="/my-cases"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/my-cases') ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              My Products
            </Link>
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-sm hover:border-slate-600 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline font-medium text-slate-200">{user?.fullName}</span>
            </Link>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Floating EcoGuide AI Chatbot Button & Drawer */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-lime-500 text-white font-semibold shadow-xl hover:scale-105 transition-all shadow-emerald-900/50 group"
          >
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>EcoGuide AI</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 animate-ping" />
          </button>
        ) : (
          <div className="w-[360px] sm:w-[420px] h-[550px] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">EcoGuide AI Assistant</h3>
                  <span className="text-[10px] text-emerald-400">Rule & Context Aware</span>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <EcoGuideChatbot />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLayout;
