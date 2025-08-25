const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Query = require('../models/Query');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/v1/queries/analyze
// @desc    Analyze a query for safety
// @access  Private
router.post('/analyze', auth, [
  body('query')
    .notEmpty()
    .withMessage('Query text is required')
    .isLength({ max: 10000 })
    .withMessage('Query cannot exceed 10000 characters'),
  body('options').optional().isObject()
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

    const { query: queryText, options = {} } = req.body;
    const startTime = Date.now();

    // Mock analysis (replace with actual AI analysis)
    const mockAnalysis = {
      safety: Math.random() > 0.2 ? 'safe' : 'unsafe',
      riskLevel: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
      confidence: 0.7 + Math.random() * 0.3,
      category: ['Educational', 'Creative', 'Technical', 'Business', 'None'][Math.floor(Math.random() * 5)],
      severity: Math.floor(Math.random() * 10) + 1,
      reason: 'Automated analysis completed',
      geminiResponse: 'This is a mock response from the AI system.',
      emotion: {
        type: ['neutral', 'positive', 'curious'][Math.floor(Math.random() * 3)],
        emoji: '😐'
      }
    };

    const responseTime = Date.now() - startTime;

    // Save query to database
    const newQuery = new Query({
      userId: req.user.id,
      query: queryText,
      analysis: mockAnalysis,
      flagged: mockAnalysis.safety === 'unsafe',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      responseTime
    });

    await newQuery.save();

    res.json({
      success: true,
      data: {
        id: newQuery._id,
        query: queryText,
        riskLevel: mockAnalysis.riskLevel,
        confidence: mockAnalysis.confidence,
        categories: [mockAnalysis.category],
        flags: mockAnalysis.safety === 'unsafe' ? [mockAnalysis.reason] : [],
        emotionalAnalysis: {
          dominant: mockAnalysis.emotion.type,
          confidence: mockAnalysis.confidence,
          emotions: {
            positive: mockAnalysis.emotion.type === 'positive' ? 0.8 : 0.2,
            neutral: mockAnalysis.emotion.type === 'neutral' ? 0.8 : 0.3,
            negative: mockAnalysis.emotion.type === 'negative' ? 0.8 : 0.1
          }
        },
        timestamp: newQuery.createdAt
      }
    });
  } catch (error) {
    console.error('Query analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during query analysis'
    });
  }
});

// @route   GET /api/v1/queries
// @desc    Get user's queries with pagination and filtering
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('flagged').optional().isBoolean().withMessage('Flagged must be a boolean'),
  query('riskLevel').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid risk level'),
  query('category').optional().isString(),
  query('dateFrom').optional().isISO8601().withMessage('Invalid date format for dateFrom'),
  query('dateTo').optional().isISO8601().withMessage('Invalid date format for dateTo')
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { userId: req.user.id };
    
    if (req.query.flagged !== undefined) {
      filter.flagged = req.query.flagged === 'true';
    }
    
    if (req.query.riskLevel) {
      filter['analysis.riskLevel'] = req.query.riskLevel;
    }
    
    if (req.query.category) {
      filter['analysis.category'] = req.query.category;
    }
    
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom);
      }
      if (req.query.dateTo) {
        filter.createdAt.$lte = new Date(req.query.dateTo);
      }
    }

    const queries = await Query.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-userId -ipAddress -userAgent');

    const total = await Query.countDocuments(filter);

    res.json({
      success: true,
      data: {
        queries,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get queries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching queries'
    });
  }
});

// @route   GET /api/v1/queries/realtime
// @desc    Get real-time queries for monitoring
// @access  Private
router.get('/realtime', auth, async (req, res) => {
  try {
    const queries = await Query.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('query analysis.riskLevel analysis.confidence analysis.emotion flagged createdAt');

    const formattedQueries = queries.map(q => ({
      id: q._id,
      query: q.query,
      riskLevel: q.analysis.riskLevel,
      timestamp: q.createdAt,
      flagged: q.flagged,
      confidence: q.analysis.confidence,
      emotion: q.analysis.emotion.type
    }));

    res.json({
      success: true,
      data: formattedQueries
    });
  } catch (error) {
    console.error('Get real-time queries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching real-time queries'
    });
  }
});

// @route   GET /api/v1/queries/:id
// @desc    Get specific query details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const query = await Query.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error('Get query details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching query details'
    });
  }
});

module.exports = router;