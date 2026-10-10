const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EWasteCase',
      required: false // May be generated before final case confirmation
    },
    tempId: {
      type: String,
      default: null
    },
    predictedCategory: {
      type: String,
      required: true
    },
    visualConditionEstimate: {
      type: String,
      required: true
    },
    possibleDamage: [
      {
        type: String
      }
    ],
    reusableComponents: [
      {
        type: String
      }
    ],
    hazardWarnings: [
      {
        type: String
      }
    ],
    recommendedNextAction: {
      type: String,
      enum: [
        'Repair and reuse',
        'Refurbish',
        'Salvage components',
        'Send for authorized recycling',
        'Requires specialist inspection'
      ],
      required: true
    },
    repairabilityScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    reusePotentialScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    recyclingScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    environmentalImpact: {
      estimatedCo2SavedKg: { type: Number, default: 0 },
      estimatedMaterialSavedKg: { type: Number, default: 0 },
      methodologyNote: { type: String, default: '' }
    },
    confidenceValue: {
      type: Number,
      min: 0,
      max: 1,
      default: null
    },
    scoringMethod: {
      type: String,
      default: 'Rule-Based Heuristics Matrix v1.0'
    },
    isDemoMode: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
