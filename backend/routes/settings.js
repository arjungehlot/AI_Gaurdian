const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// @route   GET /api/v1/settings/profile
// @desc    Get user profile settings
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Get profile settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile settings'
    });
  }
});

// @route   PUT /api/v1/settings/profile
// @desc    Update user profile settings
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
  body('lastName').optional().isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
  body('company').optional().isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters')
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

    const { firstName, lastName, company } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, company },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile settings'
    });
  }
});

// @route   GET /api/v1/settings/notifications
// @desc    Get notification settings
// @access  Private
router.get('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings.notifications');
    
    res.json({
      success: true,
      data: user.settings.notifications
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notification settings'
    });
  }
});

// @route   PUT /api/v1/settings/notifications
// @desc    Update notification settings
// @access  Private
router.put('/notifications', auth, [
  body('highRisk').optional().isBoolean(),
  body('mediumRisk').optional().isBoolean(),
  body('weeklyReports').optional().isBoolean(),
  body('monthlyReports').optional().isBoolean(),
  body('systemAlerts').optional().isBoolean()
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

    const { highRisk, mediumRisk, weeklyReports, monthlyReports, systemAlerts } = req.body;
    
    const updateData = {};
    if (highRisk !== undefined) updateData['settings.notifications.highRisk'] = highRisk;
    if (mediumRisk !== undefined) updateData['settings.notifications.mediumRisk'] = mediumRisk;
    if (weeklyReports !== undefined) updateData['settings.notifications.weeklyReports'] = weeklyReports;
    if (monthlyReports !== undefined) updateData['settings.notifications.monthlyReports'] = monthlyReports;
    if (systemAlerts !== undefined) updateData['settings.notifications.systemAlerts'] = systemAlerts;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('settings.notifications');

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: user.settings.notifications
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification settings'
    });
  }
});

// @route   GET /api/v1/settings/preferences
// @desc    Get user preferences
// @access  Private
router.get('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings.preferences');
    
    res.json({
      success: true,
      data: user.settings.preferences
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching preferences'
    });
  }
});

// @route   PUT /api/v1/settings/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, [
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  body('timezone').optional().isString(),
  body('dateFormat').optional().isIn(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']),
  body('defaultReportFormat').optional().isIn(['csv', 'xlsx', 'pdf', 'json'])
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

    const { theme, timezone, dateFormat, defaultReportFormat } = req.body;
    
    const updateData = {};
    if (theme) updateData['settings.preferences.theme'] = theme;
    if (timezone) updateData['settings.preferences.timezone'] = timezone;
    if (dateFormat) updateData['settings.preferences.dateFormat'] = dateFormat;
    if (defaultReportFormat) updateData['settings.preferences.defaultReportFormat'] = defaultReportFormat;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('settings.preferences');

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.settings.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences'
    });
  }
});

// @route   GET /api/v1/settings/api-keys
// @desc    Get user's API keys
// @access  Private
router.get('/api-keys', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('apiKeys');
    
    // Don't send the actual keys, just metadata
    const apiKeys = user.apiKeys.map(key => ({
      id: key._id,
      name: key.name,
      key: key.key.substring(0, 12) + '...' + key.key.substring(key.key.length - 4),
      createdAt: key.createdAt,
      lastUsed: key.lastUsed,
      isActive: key.isActive
    }));

    res.json({
      success: true,
      data: apiKeys
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching API keys'
    });
  }
});

// @route   POST /api/v1/settings/api-keys
// @desc    Create new API key
// @access  Private
router.post('/api-keys', auth, [
  body('name').notEmpty().withMessage('API key name is required').isLength({ max: 100 })
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

    const { name } = req.body;
    
    // Generate new API key
    const apiKey = 'sk_' + crypto.randomBytes(32).toString('hex');
    
    const user = await User.findById(req.user.id);
    
    // Check if user has reached API key limit (e.g., 10 keys)
    if (user.apiKeys.length >= 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum number of API keys reached'
      });
    }

    user.apiKeys.push({
      name,
      key: apiKey,
      createdAt: new Date(),
      isActive: true
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: {
        name,
        key: apiKey,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating API key'
    });
  }
});

// @route   DELETE /api/v1/settings/api-keys/:keyId
// @desc    Delete API key
// @access  Private
router.delete('/api-keys/:keyId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const keyIndex = user.apiKeys.findIndex(key => key._id.toString() === req.params.keyId);
    
    if (keyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'API key not found'
      });
    }

    user.apiKeys.splice(keyIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'API key deleted successfully'
    });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting API key'
    });
  }
});

module.exports = router;