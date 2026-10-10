const mongoose = require('mongoose');

const caseStatusEnum = [
  'Submitted',
  'Under Review',
  'Agent Assigned',
  'Assessment Confirmed',
  'Awaiting Collection',
  'Collected',
  'Repair / Refurbishment / Recycling',
  'Completed',
  'Rejected',
  'Cancelled',
  'Needs More Information'
];

const categoryEnum = [
  'mobile phone',
  'laptop',
  'desktop',
  'monitor',
  'tablet',
  'battery',
  'charger',
  'keyboard',
  'mouse',
  'printer',
  'television',
  'cable',
  'appliance',
  'other'
];

const eWasteCaseSchema = new mongoose.Schema(
  {
    caseReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Device category is required'],
      enum: categoryEnum
    },
    brand: {
      type: String,
      trim: true,
      default: ''
    },
    model: {
      type: String,
      trim: true,
      default: ''
    },
    approxAge: {
      type: String,
      trim: true,
      default: 'Unknown'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    physicalCondition: {
      type: String,
      enum: ['working', 'partially working', 'damaged', 'not working'],
      required: true
    },
    visibleDamage: {
      type: String,
      trim: true,
      default: 'None reported'
    },
    missingComponents: {
      type: String,
      trim: true,
      default: 'None'
    },
    batteryStatus: {
      type: String,
      trim: true,
      default: 'Normal'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    pickupAddress: {
      type: String,
      trim: true,
      default: ''
    },
    preferredContact: {
      type: String,
      trim: true,
      default: ''
    },
    images: [
      {
        url: { type: String, required: true },
        key: { type: String }, // AWS S3 key or filename
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    status: {
      type: String,
      enum: caseStatusEnum,
      default: 'Submitted'
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    inspectionFindings: {
      type: String,
      default: ''
    },
    recommendedAction: {
      type: String,
      enum: ['repair', 'refurbishment', 'component recovery', 'recycling', 'specialist inspection', 'none'],
      default: 'none'
    },
    internalNotes: [
      {
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        authorName: { type: String },
        note: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    publicNotes: [
      {
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        authorName: { type: String },
        note: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Indexing for search & dashboard queries
eWasteCaseSchema.index({ userId: 1, status: 1 });
eWasteCaseSchema.index({ assignedAgentId: 1 });

module.exports = mongoose.model('EWasteCase', eWasteCaseSchema);
