import React, { useState } from 'react';
import { ShieldAlert, HardDrive, Battery, Smartphone, Laptop, Tv, Search, CheckCircle, AlertTriangle } from 'lucide-react';

const EWasteGuidePage = () => {
  const [activeTab, setActiveTab] = useState('categories');

  const categories = [
    { title: 'Smartphones & Tablets', icon: Smartphone, hazard: 'Medium', advice: 'Sign out of iCloud / Google Account before factory reset. Lithium battery safety applies.' },
    { title: 'Laptops & Computers', icon: Laptop, hazard: 'Medium', advice: 'Remove or wipe hard drive/SSD using BitLocker / macOS Erase Assistant.' },
    { title: 'Batteries & Power Banks', icon: Battery, hazard: 'HIGH (Fire Risk)', advice: 'Swollen or damaged batteries MUST be isolated in non-flammable containers. Never throw in trash.' },
    { title: 'Monitors & Televisions', icon: Tv, hazard: 'High (Capacitor/Glass)', advice: 'Do not dismantle screen panels manually due to high voltage capacitors and mercury backlights in older LCDs.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>E-Waste Disposal & Safety Guide</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Device Handling & Data Safety</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Learn how to erase private data, identify battery hazards, and categorize electronic items for safe pickup.
        </p>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
                  <cat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{cat.title}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                cat.hazard.includes('HIGH') ? 'bg-red-950 text-red-400 border border-red-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'
              }`}>
                Hazard Level: {cat.hazard}
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{cat.advice}</p>
          </div>
        ))}
      </div>

      {/* Data Wiping Step-by-Step Guide */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-emerald-400" />
          Data Erasure Standard Operating Procedures
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Apple iOS / macOS</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Turn off Find My iPhone / Mac</li>
              <li>Sign out of Apple ID / iCloud</li>
              <li>Settings &gt; Erase All Content & Settings</li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Android Smart Devices</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Remove Google Account from Settings &gt; Accounts</li>
              <li>Disable Screen Lock PIN</li>
              <li>Perform Factory Data Reset</li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm">Windows 10 / 11 PCs</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Backup personal files to external drive</li>
              <li>Settings &gt; System &gt; Recovery &gt; Reset PC</li>
              <li>Choose "Remove Everything & Clean Drive"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EWasteGuidePage;
