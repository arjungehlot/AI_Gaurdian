const express = require('express');
const Query = require('../models/Query');
const { auth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   GET /api/v1/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total queries count
    const totalQueries = await Query.countDocuments({ userId });
    
    // Get flagged queries count
    const flaggedQueries = await Query.countDocuments({ userId, flagged: true });
    
    // Get safe queries count
    const safeQueries = totalQueries - flaggedQueries;
    
    // Calculate average risk score
    const riskScoreAgg = await Query.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          avgRiskScore: { $avg: '$analysis.confidence' }
        }
      }
    ]);
    
    const averageRiskScore = riskScoreAgg.length > 0 ? riskScoreAgg[0].avgRiskScore : 0;

    // Get today's stats
    const today = moment().startOf('day');
    const todayQueries = await Query.countDocuments({
      userId,
      createdAt: { $gte: today.toDate() }
    });
    
    const todayFlagged = await Query.countDocuments({
      userId,
      flagged: true,
      createdAt: { $gte: today.toDate() }
    });

    // Calculate response time average
    const responseTimeAgg = await Query.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);
    
    const averageResponseTime = responseTimeAgg.length > 0 ? Math.round(responseTimeAgg[0].avgResponseTime) : 0;

    res.json({
      success: true,
      data: {
        totalQueries,
        flaggedQueries,
        safeQueries,
        averageRiskScore: Number(averageRiskScore.toFixed(2)),
        todayStats: {
          queries: todayQueries,
          flagged: todayFlagged,
          safe: todayQueries - todayFlagged
        },
        averageResponseTime,
        systemUptime: '99.9%' // Mock data
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
});

// @route   GET /api/v1/dashboard/recent-activity
// @desc    Get recent activity for dashboard
// @access  Private
router.get('/recent-activity', auth, async (req, res) => {
  try {
    const recentQueries = await Query.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('query analysis.riskLevel analysis.confidence analysis.emotion flagged createdAt');

    const formattedActivity = recentQueries.map(query => ({
      id: query._id,
      query: query.query.substring(0, 100) + (query.query.length > 100 ? '...' : ''),
      riskLevel: query.analysis.riskLevel,
      confidence: query.analysis.confidence,
      emotion: query.analysis.emotion.type,
      flagged: query.flagged,
      timestamp: query.createdAt
    }));

    res.json({
      success: true,
      data: formattedActivity
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent activity'
    });
  }
});

// @route   GET /api/v1/dashboard/alerts
// @desc    Get active alerts
// @access  Private
router.get('/alerts', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const last24Hours = moment().subtract(24, 'hours').toDate();
    
    // Get high risk queries in last 24 hours
    const highRiskQueries = await Query.countDocuments({
      userId,
      'analysis.riskLevel': 'high',
      createdAt: { $gte: last24Hours }
    });
    
    // Get rate limit warnings (mock data)
    const rateLimitWarnings = 0;
    
    // Get system alerts (mock data)
    const systemAlerts = [];

    const alerts = [];
    
    if (highRiskQueries > 0) {
      alerts.push({
        type: 'high-risk',
        title: 'High Risk Query Detected',
        message: `${highRiskQueries} high-risk queries detected in the last 24 hours`,
        timestamp: new Date(),
        severity: 'high'
      });
    }
    
    if (rateLimitWarnings > 0) {
      alerts.push({
        type: 'rate-limit',
        title: 'Rate Limit Warning',
        message: 'Approaching API rate limit',
        timestamp: moment().subtract(15, 'minutes').toDate(),
        severity: 'medium'
      });
    }

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Dashboard alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alerts'
    });
  }
});

module.exports = router;