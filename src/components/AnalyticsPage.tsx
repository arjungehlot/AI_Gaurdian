import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { analyticsData } from '../data/dashboardData';

const AnalyticsPage = () => {
  const { riskLevels, categories, emotionalAnalysis, weeklyTrends } = analyticsData;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of AI query patterns and safety metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Last 30 days</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">98.2%</p>
              <p className="text-sm text-gray-600">Safety Rate</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <BarChart3 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12%</p>
              <p className="text-sm text-gray-600">Week Growth</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <PieChart className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">156ms</p>
              <p className="text-sm text-gray-600">Avg Response</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <TrendingUp className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1.8%</p>
              <p className="text-sm text-gray-600">Risk Rate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Risk Level Distribution</h3>
          <div className="space-y-4">
            {riskLevels.map((level, index) => (
              <div key={level.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: level.color }}
                  ></div>
                  <span className="text-gray-700">{level.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${level.value}%`,
                        backgroundColor: level.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{level.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Query Categories</h3>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <span className="text-gray-700">{category.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(category.count / Math.max(...categories.map(c => c.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {category.count.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Emotional Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Emotional Analysis</h3>
          <div className="space-y-4">
            {emotionalAnalysis.map((emotion, index) => (
              <div key={emotion.emotion} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  ></div>
                  <span className="text-gray-700">{emotion.emotion}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${emotion.percentage}%`,
                        backgroundColor: emotion.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{emotion.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Trends</h3>
          <div className="space-y-4">
            {weeklyTrends.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4">
                <span className="text-gray-700 w-12">{day.day}</span>
                <div className="flex-1 flex space-x-1">
                  <div 
                    className="bg-green-500 rounded h-4 flex items-center justify-center text-xs text-white font-medium"
                    style={{ width: `${(day.safe / (day.safe + day.flagged)) * 100}%`, minWidth: '20px' }}
                  >
                    {day.safe}
                  </div>
                  <div 
                    className="bg-red-500 rounded h-4 flex items-center justify-center text-xs text-white font-medium"
                    style={{ width: `${(day.flagged / (day.safe + day.flagged)) * 100}%`, minWidth: '20px' }}
                  >
                    {day.flagged}
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {(day.safe + day.flagged).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Safe Queries</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Flagged Queries</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;