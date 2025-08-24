const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Report name is required'],
    maxlength: [200, 'Report name cannot exceed 200 characters']
  },
  type: {
    type: String,
    enum: ['Safety Analysis', 'Risk Assessment', 'Emotional Analysis', 'Usage Statistics', 'Custom Report'],
    required: true
  },
  dateRange: {
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date,
      required: true
    }
  },
  format: {
    type: String,
    enum: ['csv', 'xlsx', 'pdf', 'json'],
    required: true
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  data: {
    totalQueries: {
      type: Number,
      default: 0
    },
    flaggedQueries: {
      type: Number,
      default: 0
    },
    safeQueries: {
      type: Number,
      default: 0
    },
    averageRiskScore: {
      type: Number,
      default: 0
    },
    categoryBreakdown: [{
      category: String,
      count: Number,
      percentage: Number
    }],
    riskLevelBreakdown: [{
      level: String,
      count: Number,
      percentage: Number
    }],
    emotionalAnalysis: [{
      emotion: String,
      count: Number,
      percentage: Number
    }],
    dailyStats: [{
      date: Date,
      totalQueries: Number,
      flaggedQueries: Number,
      safeQueries: Number
    }]
  },
  fileUrl: String,
  fileSize: Number, // in bytes
  downloadCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

// Index for better query performance
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model('Report', reportSchema);