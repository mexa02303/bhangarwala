const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EWasteCase',
      default: null
    },
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    isRuleBased: {
      type: Boolean,
      default: true
    },
    metadata: {
      suggestedActions: [
        {
          label: String,
          action: String,
          link: String
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
