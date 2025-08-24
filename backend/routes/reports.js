const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Report = require('../models/Report');
const Query = require('../models/Query');
const { auth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   POST /api/v1/reports/generate
// @desc    Generate a new report
// @access  Private
router.post('/generate', auth, [
  body('name').notEmpty().withMessage('Report name is required'),
  body('type').isIn(['Safety Analysis', 'Risk Assessment', 'Emotional Analysis', 'Usage Statistics', 'Custom Report']),
  body('dateRange.from').isISO8601().withMessage('Invalid from date'),
  body('dateRange.to').isISO8601().withMessage('Invalid to date'),
  body('format').isIn(['csv', 'xlsx', 'pdf', 'json'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, type, dateRange, format } = req.body;
    const userId = req.user.id;

    // Create report record
    const report = new Report({
      userId,
      name,
      type,
      dateRange: {
        from: new Date(dateRange.from),
        to: new Date(dateRange.to)
      },
      format,
      status: 'generating'
    });

    await report.save();

    // Generate report data (in a real app, this would be done asynchronously)
    const reportData = await generateReportData(userId, dateRange.from, dateRange.to, type);
    
    // Update report with data
    report.data = reportData;
    report.status = 'completed';
    report.completedAt = new Date();
    report.fileSize = JSON.stringify(reportData).length; // Mock file size
    
    await report.save();

    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      data: report
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during report generation'
    });
  }
});

// @route   GET /api/v1/reports
// @desc    Get user's reports
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('type').optional().isString(),
  query('status').optional().isIn(['generating', 'completed', 'failed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-data'); // Exclude large data field from list

    const total = await Report.countDocuments(filter);

    // Format reports for frontend
    const formattedReports = reports.map(report => ({
      id: report._id,
      name: report.name,
      type: report.type,
      date: report.createdAt.toISOString().split('T')[0],
      queries: report.data?.totalQueries || 0,
      flagged: report.data?.flaggedQueries || 0,
      format: report.format.toUpperCase(),
      size: formatFileSize(report.fileSize || 0),
      status: report.status,
      createdAt: report.createdAt,
      completedAt: report.completedAt
    }));

    res.json({
      success: true,
      data: {
        reports: formattedReports,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reports'
    });
  }
});

// @route   GET /api/v1/reports/:id
// @desc    Get specific report
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching report'
    });
  }
});

// @route   POST /api/v1/reports/:id/download
// @desc    Download report
// @access  Private
router.post('/:id/download', auth, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Report is not ready for download'
      });
    }

    // Increment download count
    report.downloadCount += 1;
    await report.save();

    // In a real application, you would generate and return the actual file
    // For now, we'll return the report data
    res.json({
      success: true,
      message: 'Report download initiated',
      data: report.data,
      format: report.format
    });
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during report download'
    });
  }
});

// Helper function to generate report data
async function generateReportData(userId, fromDate, toDate, reportType) {
  const queries = await Query.find({
    userId,
    createdAt: {
      $gte: new Date(fromDate),
      $lte: new Date(toDate)
    }
  });

  const totalQueries = queries.length;
  const flaggedQueries = queries.filter(q => q.flagged).length;
  const safeQueries = totalQueries - flaggedQueries;
  
  // Calculate average risk score
  const avgRiskScore = queries.length > 0 
    ? queries.reduce((sum, q) => sum + q.analysis.confidence, 0) / queries.length 
    : 0;

  // Category breakdown
  const categoryMap = {};
  queries.forEach(q => {
    const category = q.analysis.category || 'Unknown';
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
    percentage: totalQueries > 0 ? Math.round((count / totalQueries) * 100) : 0
  }));

  // Risk level breakdown
  const riskMap = { low: 0, medium: 0, high: 0 };
  queries.forEach(q => {
    riskMap[q.analysis.riskLevel] = (riskMap[q.analysis.riskLevel] || 0) + 1;
  });

  const riskLevelBreakdown = Object.entries(riskMap).map(([level, count]) => ({
    level,
    count,
    percentage: totalQueries > 0 ? Math.round((count / totalQueries) * 100) : 0
  }));

  // Emotional analysis
  const emotionMap = {};
  queries.forEach(q => {
    const emotion = q.analysis.emotion?.type || 'neutral';
    emotionMap[emotion] = (emotionMap[emotion] || 0) + 1;
  });

  const emotionalAnalysis = Object.entries(emotionMap).map(([emotion, count]) => ({
    emotion,
    count,
    percentage: totalQueries > 0 ? Math.round((count / totalQueries) * 100) : 0
  }));

  // Daily stats
  const dailyStats = [];
  const startDate = moment(fromDate);
  const endDate = moment(toDate);
  
  for (let date = startDate.clone(); date.isSameOrBefore(endDate); date.add(1, 'day')) {
    const dayQueries = queries.filter(q => 
      moment(q.createdAt).isSame(date, 'day')
    );
    
    dailyStats.push({
      date: date.toDate(),
      totalQueries: dayQueries.length,
      flaggedQueries: dayQueries.filter(q => q.flagged).length,
      safeQueries: dayQueries.filter(q => !q.flagged).length
    });
  }

  return {
    totalQueries,
    flaggedQueries,
    safeQueries,
    averageRiskScore: Number(avgRiskScore.toFixed(2)),
    categoryBreakdown,
    riskLevelBreakdown,
    emotionalAnalysis,
    dailyStats
  };
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = router;