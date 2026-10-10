import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  BarChart3,
  Leaf,
  FileCheck,
  Check
} from 'lucide-react';
import api from '../api/axios';

const CATEGORIES = [
  { value: 'mobile phone', label: 'Mobile Phone' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'desktop', label: 'Desktop Computer' },
  { value: 'monitor', label: 'Monitor / Display' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'battery', label: 'Battery / Power Bank' },
  { value: 'charger', label: 'Charger / Adapter' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'printer', label: 'Printer / Scanner' },
  { value: 'television', label: 'Television' },
  { value: 'cable', label: 'Cables & Wiring' },
  { value: 'appliance', label: 'Home Appliance' },
  { value: 'other', label: 'Other Electronic Equipment' }
];

const SubmitEWastePage = () => {
  const navigate = useNavigate();

  // Wizard Step State: 1 | 2 | 3 | 4 | 5
  const [step, setStep] = useState(1);

  // Step 1: Product Info
  const [productInfo, setProductInfo] = useState({
    productName: '',
    category: 'laptop',
    brand: '',
    model: '',
    approxAge: '1-2 years',
    quantity: 1,
    physicalCondition: 'working',
    visibleDamage: 'None reported',
    missingComponents: 'None',
    batteryStatus: 'Normal',
    description: '',
    pickupAddress: '',
    preferredContact: ''
  });

  // Step 2: Image Files & Previews
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  // Step 3: Scanning Progress
  const [scanStage, setScanStage] = useState(0);

  // Step 4: Assessment Result
  const [assessment, setAssessment] = useState(null);
  const [confirmedPreliminary, setConfirmedPreliminary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Step 5: Created Case Success Record
  const [createdCase, setCreatedCase] = useState(null);

  // Step 1 Change Handler
  const handleInfoChange = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  // Step 2 File Selection Handler with format & size validation
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const validateAndAddFiles = (files) => {
    setImageError('');
    const validFiles = [];
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif'];

    for (const f of files) {
      if (!allowed.includes(f.type.toLowerCase())) {
        setImageError(`File '${f.name}' has invalid format. Please upload JPG, PNG, WEBP, or GIF images.`);
        return;
      }
      if (f.size > 10 * 1024 * 1024) {
        setImageError(`File '${f.name}' exceeds maximum allowed size of 10MB.`);
        return;
      }
      validFiles.push(f);
    }

    const updated = [...selectedFiles, ...validFiles].slice(0, 5);
    setSelectedFiles(updated);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Upload Images & Trigger Step 3 Visual Scanning Animation
  const startAssessment = async () => {
    if (selectedFiles.length === 0) {
      setImageError('Please select at least one product photo to run visual assessment.');
      return;
    }

    setStep(3); // Go to Scan Animation
    setScanStage(1); // Stage 1: Uploading

    try {
      // Upload Images
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('images', file));

      const uploadRes = await api.post('/cases/upload-images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imgs = uploadRes.data.images || [];
      setUploadedImages(imgs);

      // Sequential Scanning Stages Simulation for UI Feedback
      setTimeout(() => setScanStage(2), 1000); // Stage 2: Inspecting device
      setTimeout(() => setScanStage(3), 2000); // Stage 3: Assessing visible condition

      // Fetch Assessment Draft from backend
      const draftRes = await api.post('/cases/assess-draft', {
        ...productInfo,
        images: imgs
      });

      setTimeout(() => {
        setScanStage(4); // Stage 4: Preparing recommendations
        setAssessment(draftRes.data.assessment);
        setTimeout(() => setStep(4), 800); // Move to Step 4 Assessment Report
      }, 3000);
    } catch (err) {
      console.error('Assessment failed:', err);
      setImageError(err.message || 'Image upload or assessment failed.');
      setStep(2);
    }
  };

  // Final Confirmation & Case Creation (Step 4 -> Step 5)
  const handleFinalSubmit = async () => {
    if (!confirmedPreliminary) return;
    setSubmitting(true);

    try {
      const res = await api.post('/cases', {
        ...productInfo,
        images: uploadedImages
      });

      if (res.data.success) {
        setCreatedCase(res.data.case);
        setStep(5);
      }
    } catch (err) {
      console.error('Case submission error:', err);
      alert(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Step Indicator */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">E-Waste Submission Wizard</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Provide item details, upload photos, and view transparent recovery scoring.
        </p>

        {/* Steps Bar */}
        {step <= 4 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            {[
              { num: 1, label: 'Product Info' },
              { num: 2, label: 'Image Upload' },
              { num: 3, label: 'AI Scan' },
              { num: 4, label: 'Assessment' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                    step === s.num
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-950/60'
                      : step > s.num
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-slate-900 text-slate-600 border-slate-800'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {s.num < 4 && <div className="w-6 h-0.5 bg-slate-800 hidden sm:block" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STEP 1 — PRODUCT DETAILS */}
      {step === 1 && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            Step 1 — Electronic Device Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Product Name *</label>
              <input
                type="text"
                name="productName"
                required
                value={productInfo.productName}
                onChange={handleInfoChange}
                placeholder="e.g. MacBook Pro 15-inch 2019 or iPhone 11"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Device Category *</label>
              <select
                name="category"
                value={productInfo.category}
                onChange={handleInfoChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Physical Condition *</label>
              <select
                name="physicalCondition"
                value={productInfo.physicalCondition}
                onChange={handleInfoChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="working">Working (Fully functional)</option>
                <option value="partially working">Partially Working (Minor flaws)</option>
                <option value="damaged">Damaged (Broken screen / heavy wear)</option>
                <option value="not working">Not Working (Power failure / dead)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Brand Name (Optional)</label>
              <input
                type="text"
                name="brand"
                value={productInfo.brand}
                onChange={handleInfoChange}
                placeholder="e.g. Apple, Dell, Samsung"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Model (Optional)</label>
              <input
                type="text"
                name="model"
                value={productInfo.model}
                onChange={handleInfoChange}
                placeholder="e.g. A1990 or XPS 13"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Approximate Age</label>
              <select
                name="approxAge"
                value={productInfo.approxAge}
                onChange={handleInfoChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="< 1 year">Less than 1 year</option>
                <option value="1-2 years">1 to 2 years</option>
                <option value="3-5 years">3 to 5 years</option>
                <option value="5+ years">More than 5 years</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={productInfo.quantity}
                onChange={handleInfoChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Visible Damage</label>
              <input
                type="text"
                name="visibleDamage"
                value={productInfo.visibleDamage}
                onChange={handleInfoChange}
                placeholder="e.g. Cracked glass, scratched housing, liquid stain"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Battery Status</label>
              <input
                type="text"
                name="batteryStatus"
                value={productInfo.batteryStatus}
                onChange={handleInfoChange}
                placeholder="e.g. Normal, Service Recommended, Swollen, Missing"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">Approximate Pickup Location / Address</label>
              <input
                type="text"
                name="pickupAddress"
                value={productInfo.pickupAddress}
                onChange={handleInfoChange}
                placeholder="Street address or city location for field agent collection"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                if (!productInfo.productName.trim()) {
                  alert('Please enter a product name before proceeding.');
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all"
            >
              Continue to Image Upload
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — IMAGE UPLOAD */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            Step 2 — Upload Device Images (Max 5)
          </h2>

          {imageError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{imageError}</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl p-8 text-center space-y-4 bg-slate-950/40 transition-colors cursor-pointer relative"
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800/40">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Drag & drop product images here, or click to browse</p>
              <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP, GIF (Max 10MB per image)</p>
            </div>
          </div>

          {/* Selected File Previews */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-300">Selected Photos ({selectedFiles.length}/5):</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-square bg-slate-950">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload preview ${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/90 text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={startAssessment}
              disabled={selectedFiles.length === 0}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              Run Visual Assessment
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — SCANNING ANIMATION */}
      {step === 3 && (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="w-24 h-24 rounded-3xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center mx-auto relative shadow-2xl">
            <Sparkles className="w-12 h-12 text-emerald-400 animate-pulse" />
            <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500 animate-ping opacity-20" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">Visual Scanning In Progress</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Analyzing visual condition heuristics, component harvestability, and category degradation benchmarks.
            </p>
          </div>

          {/* Sequential Stages Indicator */}
          <div className="max-w-md mx-auto space-y-3 text-xs">
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${scanStage >= 1 ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
              <span className="font-semibold">1. Uploading image artifacts</span>
              {scanStage > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : scanStage === 1 ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : null}
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${scanStage >= 2 ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
              <span className="font-semibold">2. Inspecting device structure</span>
              {scanStage > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : scanStage === 2 ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : null}
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${scanStage >= 3 ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
              <span className="font-semibold">3. Assessing physical condition</span>
              {scanStage > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : scanStage === 3 ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : null}
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${scanStage >= 4 ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
              <span className="font-semibold">4. Preparing transparent recommendations</span>
              {scanStage === 4 ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : null}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 — ASSESSMENT REPORT */}
      {step === 4 && assessment && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">Assessment Report</span>
              <h2 className="text-xl font-bold text-white">{productInfo.productName}</h2>
            </div>

            <div className="px-3 py-1 rounded-full bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-mono">
              {assessment.scoringMethod}
            </div>
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Repairability Score</span>
              <span className="text-3xl font-extrabold text-emerald-400">{assessment.repairabilityScore}/100</span>
              <span className="text-[10px] text-slate-500 block">Restoration Potential</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Reuse Potential</span>
              <span className="text-3xl font-extrabold text-lime-400">{assessment.reusePotentialScore}/100</span>
              <span className="text-[10px] text-slate-500 block">Second-Life Value</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Recycling Recovery</span>
              <span className="text-3xl font-extrabold text-blue-400">{assessment.recyclingScore}/100</span>
              <span className="text-[10px] text-slate-500 block">Raw Material Yield</span>
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-950 border border-emerald-800/60 space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Suggested Next Action:</span>
            <span className="text-lg font-bold text-emerald-300 block">{assessment.recommendedNextAction}</span>
            <p className="text-xs text-slate-400 leading-relaxed">{assessment.environmentalImpact?.methodologyNote}</p>
          </div>

          {/* Environmental CO2 Savings */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-semibold">Estimated CO₂ Abatement:</span>
            </div>
            <span className="font-bold text-emerald-400">{assessment.environmentalImpact?.estimatedCo2SavedKg} kg CO₂e</span>
          </div>

          {/* Preliminary Notice & Checkbox */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/40 space-y-3">
            <div className="flex items-start gap-2 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Honest AI Disclosure:</strong> Visual assessment is preliminary and cannot verify internal battery health or hidden logic board damage. Final determination will be made upon physical inspection by certified agents.
              </span>
            </div>

            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer pt-2 border-t border-amber-800/30">
              <input
                type="checkbox"
                checked={confirmedPreliminary}
                onChange={(e) => setConfirmedPreliminary(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500"
              />
              <span>I understand that this assessment is preliminary and confirm my submission.</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Edit Photos
            </button>

            <button
              onClick={handleFinalSubmit}
              disabled={!confirmedPreliminary || submitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Case Record...
                </>
              ) : (
                <>
                  Confirm and Submit E-Waste
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 — SUCCESS CONFIRMATION */}
      {step === 5 && createdCase && (
        <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-8 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
            <FileCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">Case Created Successfully</span>
            <h2 className="text-3xl font-extrabold text-white">Reference: {createdCase.caseReference}</h2>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Your submission is now registered in our recovery network. An administrator will review your case and assign a field agent shortly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 inline-block text-left space-y-1">
            <p><strong>Item:</strong> {createdCase.productName}</p>
            <p><strong>Category:</strong> <span className="capitalize">{createdCase.category}</span></p>
            <p><strong>Initial Status:</strong> <span className="text-emerald-400 font-semibold">{createdCase.status}</span></p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/my-cases')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
            >
              View My Submitted Products
            </button>
            <button
              onClick={() => {
                setStep(1);
                setSelectedFiles([]);
                setUploadedImages([]);
                setAssessment(null);
                setConfirmedPreliminary(false);
              }}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              Submit Another Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitEWastePage;
