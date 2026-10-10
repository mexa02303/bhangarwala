import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Recycle, Leaf, ShieldCheck, ArrowRight, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">EcoRetrieve</span>
              <span className="text-xs block text-emerald-400 font-medium -mt-1">Circular Recovery Platform</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors ${isActive('/') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`transition-colors ${isActive('/how-it-works') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              How It Works
            </Link>
            <Link
              to="/ewaste-guide"
              className={`transition-colors ${isActive('/ewaste-guide') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              E-Waste Guide
            </Link>
            <Link
              to="/about"
              className={`transition-colors ${isActive('/about') ? 'text-emerald-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              About
            </Link>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'agent' ? '/agent/dashboard' : '/dashboard'}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-md shadow-emerald-900/40"
                >
                  <UserCircle className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium text-sm transition-all shadow-md shadow-emerald-900/30"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white">EcoRetrieve</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Pioneering circular electronics recovery with transparent AI heuristics, component harvesting, and certified eco-recycling workflows.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link to="/ewaste-guide" className="hover:text-emerald-400 transition-colors">E-Waste Category Guide</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Transparent Scoring Model</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Staff Access</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login?role=agent" className="hover:text-emerald-400 transition-colors">Agent Portal Login</Link></li>
              <li><Link to="/login?role=admin" className="hover:text-emerald-400 transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Sustainability</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Compliant with ITU-T L.1410 & UN E-Waste Management guidelines for carbon abatement.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
              <Leaf className="w-3.5 h-3.5" />
              100% Verified E-Waste Tracking
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 EcoRetrieve Circular Recovery Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">AWS Elastic Beanstalk & Amplify Ready</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
