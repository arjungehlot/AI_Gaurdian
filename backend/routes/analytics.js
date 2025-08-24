const express = require('express');
const Query = require('../models/Query');
const { auth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// @route   GET /api/v1/analytics/overview
// @desc    Get analytics overview
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Risk level distribution
    const riskLevels = await Query.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$analysis.riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalQueries = await Query.countDocuments({ userId });
    
    const riskLevelData = [
      { name: 'Low Risk', value: 0, color: '#10B981' },
      { name: 'Medium Risk', value: 0, color: '#F59E0B' },
      { name: 'High Risk', value: 0, color: '#EF4444' }
    ];
    
    riskLevels.forEach(level => {
      const percentage = totalQueries > 0 ? Math.round((level.count / totalQueries) * 100) : 0;
      switch (level._id) {
        case 'low':
          riskLevelData[0].value = percentage;
          break;
        case 'medium':
          riskLevelData[1].value = percentage;
          break;
        case 'high':
          riskLevelData[2].value = percentage;
          break;
      }
    });

    // Category breakdown
    const categories = await Query.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$analysis.category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const categoryData = categories.map(cat => ({
      name: cat._id || 'Unknown',
      count: cat.count
    }));

    // Emotional analysis
    const emotions = await Query.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$analysis.emotion.type',
          count: { $sum: 1 }
        }
      }
    ]);

    const emotionalData = emotions.map(emotion => {
      const percentage = totalQueries > 0 ? Math.round((emotion.count / totalQueries) * 100) : 0;
      return {
        emotion: emotion._id || 'neutral',
        percentage,
        color: getEmotionColor(emotion._id)
      };
    });

    // Weekly trends (last 7 days)
    const weeklyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      const startOfDay = date.clone().startOf('day');
      const endOfDay = date.clone().endOf('day');
      
      const dayQueries = await Query.find({
        userId,
        createdAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() }
      });
      
      const safe = dayQueries.filter(q => !q.flagged).length;
      const flagged = dayQueries.filter(q => q.flagged).length;
      
      weeklyTrends.push({
        day: date.format('ddd'),
        safe,
        flagged
      });
    }

    res.json({
      success: true,
      data: {
        riskLevels: riskLevelData,
        categories: categoryData,
        emotionalAnalysis: emotionalData,
        weeklyTrends
      }
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/v1/analytics/trends
// @desc    Get trend analysis
// @access  Private
router.get('/trends', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 30;
    
    const trends = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = moment().subtract(i, 'days');
      const startOfDay = date.clone().startOf('day');
      const endOfDay = date.clone().endOf('day');
      
      const dayStats = await Query.aggregate([
        {
          $match: {
            userId: userId,
            createdAt: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            flagged: {
              $sum: { $cond: [{ $eq: ['$flagged', true] }, 1, 0] }
            },
            avgConfidence: { $avg: '$analysis.confidence' }
          }
        }
      ]);
      
      const stats = dayStats[0] || { total: 0, flagged: 0, avgConfidence: 0 };
      
      trends.push({
        date: date.format('YYYY-MM-DD'),
        total: stats.total,
        safe: stats.total - stats.flagged,
        flagged: stats.flagged,
        avgConfidence: Number((stats.avgConfidence || 0).toFixed(2))
      });
    }

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Analytics trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching trends'
    });
  }
});

// Helper function to get emotion color
function getEmotionColor(emotion) {
  const colors = {
    happy: '#10B981',
    positive: '#10B981',
    neutral: '#6B7280',
    curious: '#3B82F6',
    sad: '#EF4444',
    angry: '#DC2626',
    fearful: '#F59E0B',
    frustrated: '#F97316',
    excited: '#8B5CF6',
    confused: '#6B7280'
  };
  return colors[emotion] || '#6B7280';
}

module.exports = router;