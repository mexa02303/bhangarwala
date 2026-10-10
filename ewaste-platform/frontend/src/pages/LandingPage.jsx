import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronDown,
  Laptop,
  Smartphone,
  BatteryCharging,
  Monitor,
  Printer,
  Cable,
  MapPin,
  FileText
} from 'lucide-react';

const ACCEPTED_ITEMS = [
  { name: 'Laptops & MacBooks', desc: 'Working, damaged, or obsolete notebooks', icon: Laptop },
  { name: 'Smartphones & Tablets', desc: 'iPhones, Android phones, and iPads', icon: Smartphone },
  { name: 'Monitors & Displays', desc: 'LCD, LED, and desktop computer screens', icon: Monitor },
  { name: 'Batteries & Chargers', desc: 'Lithium-ion packs, adapters, power banks', icon: BatteryCharging },
  { name: 'Printers & Peripherals', desc: 'Keyboards, mice, scanners, and audio', icon: Printer },
  { name: 'Cables & Wiring', desc: 'Power cords, copper cables, adapters', icon: Cable }
];

const FAQS = [
  {
    q: 'Is device collection free?',
    a: 'Yes. Once your item is submitted and reviewed, our network arranges free doorstep collection or drop-off coordination depending on your location.'
  },
  {
    q: 'How is my private data handled?',
    a: 'We strongly recommend factory resetting your phone or computer before pickup. Every collected storage drive undergoes certified multi-pass sanitization or mechanical degaussing.'
  },
  {
    q: 'What happens to items that cannot be repaired?',
    a: 'Items beyond repair are dismantled for reusable components (chassis, heat sinks, modular chips). Residual materials like copper and aluminum are sent to certified smelting facilities.'
  },
  {
    q: 'Can I submit swollen or damaged batteries?',
    a: 'Yes, but please indicate "Swollen" or "Damaged" during submission so our field team can arrive with dedicated fire-retardant safety containers.'
  }
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="space-y-24 py-8 md:py-16 text-slate-200">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Circular Electronics Recovery</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
          Responsible electronics recycling and trade-in.
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Submit unwanted phones, laptops, and hardware. Get a transparent condition report, free scheduled pickup, and certified data wiping.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            to="/submit-ewaste"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors"
          >
            Submit an Item
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition-colors"
          >
            How It Works
          </Link>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Landfill Policy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Certified Data Sanitization</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Doorstep Collection</span>
          </div>
        </div>
      </section>

      {/* How it Works - Simple 3-Step Row */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="border-t border-b border-slate-800/80 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <span className="text-xs font-mono text-emerald-400 block font-semibold">01</span>
            <h3 className="text-base font-semibold text-white">1. Tell us about the item</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select the category, describe working condition, and upload a quick photo from your phone or desktop.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-emerald-400 block font-semibold">02</span>
            <h3 className="text-base font-semibold text-white">2. Receive condition review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get an instant, transparent score on repairability, component reuse value, and recycling recovery.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono text-emerald-400 block font-semibold">03</span>
            <h3 className="text-base font-semibold text-white">3. Pickup & recovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A certified recycling agent collects your device. Functional parts are refurbished; raw metals are recovered safely.
            </p>
          </div>
        </div>
      </section>

      {/* Accepted Items Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Accepted Electronics</h2>
            <p className="text-xs text-slate-400 mt-1">We accept equipment in any condition: working, broken, or dead.</p>
          </div>
          <Link to="/ewaste-guide" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
            View preparation guide
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ACCEPTED_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety & Data Security Callout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Security & Privacy First</span>
            </div>
            <h3 className="text-lg font-bold text-white">Your privacy is guaranteed before any device is disassembled.</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personal drives are wiped to DoD standards. If a hard drive or flash chip is physically unreadable, it is shredded to sub-millimeter particles.
            </p>
          </div>
          <div className="md:text-right">
            <Link
              to="/ewaste-guide"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Read Wiping Procedures
            </Link>
          </div>
        </div>
      </section>

      {/* Clean FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about the collection process.</p>
        </div>

        <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-medium text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-400 leading-relaxed mt-2 pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Minimalist CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Ready to clear your old hardware?</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Start your submission in less than two minutes. Keep hazardous metals out of landfills.
        </p>
        <div className="pt-2">
          <Link
            to="/submit-ewaste"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors"
          >
            Submit an Item
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
