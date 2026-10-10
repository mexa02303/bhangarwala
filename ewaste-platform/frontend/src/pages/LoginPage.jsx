import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, ShieldAlert, Truck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role'); // 'admin' | 'agent' | null
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isStaff = roleParam === 'admin' || roleParam === 'agent';
  const isAdmin = roleParam === 'admin';
  const isAgent = roleParam === 'agent';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        const userRole = res.user.role;
        // Redirect based on actual server-verified user role
        if (userRole === 'admin') navigate('/admin/dashboard');
        else if (userRole === 'agent') navigate('/agent/dashboard');
        else navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Card Header & Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-500 text-white shadow-xl shadow-emerald-950/50 mb-2">
            {isAdmin ? (
              <ShieldAlert className="w-6 h-6 text-purple-200" />
            ) : isAgent ? (
              <Truck className="w-6 h-6 text-blue-200" />
            ) : (
              <Recycle className="w-6 h-6 text-white" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isAdmin ? 'Administrator Console' : isAgent ? 'Field Agent Portal' : 'Sign in to EcoRetrieve'}
          </h2>

          <p className="text-xs text-slate-400">
            {isAdmin
              ? 'Authorized staff login for system administration'
              : isAgent
              ? 'Field agent portal for e-waste inspection & collection'
              : 'Access your submitted e-waste cases & circular reports'}
          </p>

          {isStaff && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-medium mt-1">
              <ShieldAlert className="w-3 h-3" />
              <span>Query parameters only select UI theme. Security is enforced server-side.</span>
            </div>
          )}
        </div>

        {/* Login Form Container */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          {!isStaff ? (
            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-400 font-semibold hover:underline">
                Register here
              </Link>
            </div>
          ) : (
            <div className="text-center pt-2 text-xs text-slate-500">
              <Link to="/login" className="hover:text-slate-300 transition-colors">
                Return to standard Customer Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
