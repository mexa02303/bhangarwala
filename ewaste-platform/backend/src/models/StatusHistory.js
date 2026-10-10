const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EWasteCase',
      required: true
    },
    previousStatus: {
      type: String,
      default: 'None'
    },
    newStatus: {
      type: String,
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    changedByName: {
      type: String,
      default: 'System'
    },
    changedByRole: {
      type: String,
      enum: ['user', 'agent', 'admin', 'system'],
      required: true
    },
    reasonOrNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StatusHistory', statusHistorySchema);
