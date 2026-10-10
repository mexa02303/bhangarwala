import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Cpu, Truck, RefreshCw, BarChart3, AlertCircle } from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">How Circular E-Waste Recovery Works</h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          From photo submission to agent assignment, transparent scoring, and certified component recycling.
        </p>
      </div>

      <div className="space-y-12">
        {/* Step 1 */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center font-bold text-2xl">
              01
            </div>
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Step One</span>
          </div>
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-bold text-white">Submit Product Details & Upload Images</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Select your device category (mobile phone, laptop, desktop, monitor, tablet, battery, printer, etc.), enter approximate age, physical working condition, and drag & drop clear photos.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Multi-image upload with client and server-side file type & magic byte verification.</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center font-bold text-2xl">
              02
            </div>
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Step Two</span>
          </div>
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-bold text-white">Transparent Visual Assessment & Scoring</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our assessment module evaluates Repairability (0-100), Reuse Potential (0-100), and Recycling Recovery (0-100). If no external Vision AI model is connected, results are explicitly marked as "Transparent Rule-Based Assessment" to prevent false AI claims.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Includes estimated CO₂ avoided and material weight recovery estimates using UN heuristics.</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center justify-center font-bold text-2xl">
              03
            </div>
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Step Three</span>
          </div>
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-bold text-white">Agent Assignment & Field Inspection</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Administrators review incoming submissions and assign cases to specialized Field Agents. Agents perform physical inspection, upload evidence, and update status through the workflow state machine.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Status transitions: Submitted → Under Review → Agent Assigned → Awaiting Collection → Completed.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <Link
          to="/submit-ewaste"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 transition-all"
        >
          Submit Your E-Waste Case Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
