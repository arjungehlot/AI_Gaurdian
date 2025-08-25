const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: [true, 'Query text is required'],
    maxlength: [10000, 'Query cannot exceed 10000 characters']
  },
  analysis: {
    safety: {
      type: String,
      enum: ['safe', 'unsafe', 'unknown'],
      required: true
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      required: true
    },
    category: {
      type: String,
      enum: [
        'Hate Speech',
        'Harassment', 
        'Sexually Explicit',
        'Dangerous & Illegal',
        'Prompt Injection',
        'Misinformation',
        'Educational',
        'Creative',
        'Technical',
        'Business',
        'None'
      ],
      default: 'None'
    },
    severity: {
      type: Number,
      min: 1,
      max: 10,
      default: 1
    },
    reason: String,
    geminiResponse: String,
    emotion: {
      type: {
        type: String,
        enum: ['happy', 'sad', 'angry', 'confused', 'fearful', 'neutral', 'excited', 'frustrated'],
        default: 'neutral'
      },
      emoji: {
        type: String,
        default: '😐'
      }
    }
  },
  flagged: {
    type: Boolean,
    default: false
  },
  ipAddress: String,
  userAgent: String,
  responseTime: {
    type: Number, // in milliseconds
    default: 0
  },
  apiKeyUsed: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
querySchema.index({ userId: 1, createdAt: -1 });
querySchema.index({ flagged: 1, createdAt: -1 });
querySchema.index({ 'analysis.riskLevel': 1, createdAt: -1 });
querySchema.index({ 'analysis.category': 1, createdAt: -1 });

module.exports = mongoose.model('Query', querySchema);