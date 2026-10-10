import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Cpu, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Leaf, BarChart3, Truck, AlertTriangle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted E-Waste & Circular Recovery Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Transform E-Waste into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-200">Circular Value</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Transparent heuristic assessment, component salvage scoring, certified collection tracking, and product-aware AI guidance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/submit-ewaste"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 hover:to-lime-400 text-white font-bold text-base shadow-xl shadow-emerald-950/60 hover:scale-105 transition-all"
            >
              Submit E-Waste Item
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base transition-all"
            >
              Explore Recovery Process
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</span>
              <span className="text-xs text-slate-400 block mt-1">Transparent Scoring</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400">14+</span>
              <span className="text-xs text-slate-400 block mt-1">Device Categories</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400">ITU-T</span>
              <span className="text-xs text-slate-400 block mt-1">L.1410 CO₂ Abatement</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400">0%</span>
              <span className="text-xs text-slate-400 block mt-1">Fabricated AI Claims</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Process Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold text-white">How EcoRetrieve Works</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">From initial photo submission to agent collection and component recycling.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-800/40">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Device Submission</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enter device category, physical condition, and upload clear photo evidence using our multi-step form.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-800/40">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Visual Assessment</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Instant rule-based scoring evaluates Repairability (0-100), Reuse Potential, and Recycling Recovery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-800/40">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Agent Inspection</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Certified field agents verify condition, confirm collection logistics, or recommend specialized hazard handling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-800/40">
              04
            </div>
            <h3 className="text-lg font-bold text-white">Circular Recovery</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Devices undergo refurbishment for secondary life or raw copper, gold, and aluminum component recovery.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Eco Guide Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/40 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/50 text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" />
              Safety & Data Privacy First
            </div>
            <h2 className="text-3xl font-bold text-white">Need help wiping your PC, Mac, or Smartphone?</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our embedded EcoGuide AI provides step-by-step instructions for data sanitization and alerts you if damaged lithium-ion batteries require hazardous waste isolation.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/ewaste-guide"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
              >
                Read E-Waste Safety Guide
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Certified Recovery Standard Guarantees
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero landfill policy for all collected electronic hardware.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Transparent scoring formulas based on verifiable UN lifecycle heuristics.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Encrypted workflow history tracking every status change from submission to completion.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
