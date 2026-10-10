import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Calendar, Clock, CheckCircle2, AlertTriangle, ArrowLeft, Bot, ShieldCheck, Leaf, Loader2 } from 'lucide-react';
import api from '../api/axios';
import EcoGuideChatbot from '../components/EcoGuideChatbot';

const CaseDetailPage = () => {
  const { id } = useParams();
  const [caseDoc, setCaseDoc] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/cases/${id}`);
      if (res.data.success) {
        setCaseDoc(res.data.case);
        setAssessment(res.data.assessment);
        setStatusHistory(res.data.statusHistory || []);
      }
    } catch (err) {
      console.error('Error fetching case detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCase = async () => {
    if (!window.confirm('Are you sure you want to cancel this e-waste submission?')) return;
    setCancelling(true);
    try {
      const res = await api.post(`/cases/${id}/status`, {
        status: 'Cancelled',
        reasonOrNotes: 'Cancelled by user from dashboard'
      });
      if (res.data.success) {
        fetchCaseDetails();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel submission');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <span>Loading case record details...</span>
      </div>
    );
  }

  if (!caseDoc) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-400 text-sm">Case record not found or access denied.</p>
        <Link to="/my-cases" className="text-xs text-emerald-400 underline">Return to My Products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <Link to="/my-cases" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to My Products
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white">{caseDoc.productName}</h1>
            <span className="font-mono text-xs text-emerald-400 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {caseDoc.caseReference}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" />
            Ask EcoGuide About This Item
          </button>

          {['Submitted', 'Under Review'].includes(caseDoc.status) && (
            <button
              onClick={handleCancelCase}
              disabled={cancelling}
              className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60 text-xs font-semibold transition-colors"
            >
              Cancel Submission
            </button>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Info & Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Gallery */}
          {caseDoc.images && caseDoc.images.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Product Photo Evidence</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {caseDoc.images.map((img, idx) => (
                  <a key={idx} href={img.url} target="_blank" rel="noreferrer" className="block aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={img.url} alt={`Evidence ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Breakdown */}
          {assessment && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Transparent Assessment Metrics</h3>
                <span className="text-[10px] text-emerald-400 font-mono">{assessment.scoringMethod}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Repairability</span>
                  <span className="text-2xl font-bold text-emerald-400">{assessment.repairabilityScore}/100</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Reuse Potential</span>
                  <span className="text-2xl font-bold text-lime-400">{assessment.reusePotentialScore}/100</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400 block">Recycling Recovery</span>
                  <span className="text-2xl font-bold text-blue-400">{assessment.recyclingScore}/100</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <span className="text-slate-400 font-semibold block">Recommended Disposition:</span>
                <span className="text-emerald-300 font-bold text-sm block">{assessment.recommendedNextAction}</span>
                <p className="text-slate-500">{assessment.environmentalImpact?.methodologyNote}</p>
              </div>
            </div>
          )}

          {/* Embedded EcoGuide Drawer if Toggled */}
          {showChat && (
            <div className="h-[450px] rounded-3xl overflow-hidden border border-emerald-800/60 shadow-2xl">
              <EcoGuideChatbot caseContext={caseDoc} />
            </div>
          )}
        </div>

        {/* Right Column: Workflow History Timeline */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Workflow Progress Timeline
            </h3>

            <div className="relative border-l border-slate-800 ml-3 space-y-6 text-xs">
              {statusHistory.map((hist, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
                  <div className="space-y-1">
                    <span className="font-bold text-white block">{hist.newStatus}</span>
                    <span className="text-[10px] text-slate-500 block">
                      By {hist.changedByName} ({hist.changedByRole}) • {new Date(hist.createdAt).toLocaleString()}
                    </span>
                    {hist.reasonOrNotes && (
                      <p className="text-slate-400 text-[11px] bg-slate-950 p-2 rounded-lg border border-slate-800/60 mt-1">
                        "{hist.reasonOrNotes}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailPage;
