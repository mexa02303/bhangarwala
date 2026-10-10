import React from 'react';
import { Recycle, ShieldCheck, Leaf, Cpu, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">About EcoRetrieve</h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Pioneering circular economy technology through transparent heuristic scoring and verified recovery logistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
            <Recycle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Circular Economy Vision</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            We prioritize repair and component harvesting over premature shredding, keeping high-value metals and functional parts in circulation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Transparent Assessment</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Every score (Repairability, Reuse, Recycling) uses documented rule matrices based on category, age, and physical condition. We never fabricate AI confidence numbers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Environmental Impact</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            CO₂ offset calculations adhere to ITU-T L.1410 lifecycle methodologies, providing verifiable carbon abatement metrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
