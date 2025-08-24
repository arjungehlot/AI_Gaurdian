import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Eye,
  Clock,
  Users
} from 'lucide-react';
import { dashboardStats, realTimeQueries } from '../data/dashboardData';

const DashboardOverview = () => {
  const stats = [
    {
      name: 'Total Queries',
      value: dashboardStats.totalQueries.toLocaleString(),
      icon: Eye,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      name: 'Flagged Queries',
      value: dashboardStats.flaggedQueries.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      name: 'Safe Queries',
      value: dashboardStats.safeQueries.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      name: 'Avg Risk Score',
      value: dashboardStats.averageRiskScore.toFixed(2),
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    }
  ];

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmotionBadge = (emotion: string) => {
    switch (emotion) {
      case 'positive':
        return 'bg-blue-100 text-blue-800';
      case 'neutral':
        return 'bg-gray-100 text-gray-800';
      case 'curious':
        return 'bg-purple-100 text-purple-800';
      case 'concerning':
        return 'bg-red-100 text-red-800';
      case 'suspicious':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Monitor your AI safety metrics in real-time</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">System Online</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Query Analysis</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {realTimeQueries.slice(0, 5).map((query) => (
                <div key={query.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    query.flagged ? 'bg-red-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(query.riskLevel)}`}>
                        {query.riskLevel.toUpperCase()} RISK
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(query.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium mb-2 truncate">{query.query}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>Confidence: {(query.confidence * 100).toFixed(0)}%</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getEmotionBadge(query.emotion)}`}>
                        {query.emotion}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">High Risk Query Detected</p>
                  <p className="text-xs text-red-700 mt-1">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Rate Limit Warning</p>
                  <p className="text-xs text-yellow-700 mt-1">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">New API Key Created</p>
                  <p className="text-xs text-blue-700 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Queries Processed</span>
                <span className="font-semibold text-gray-900">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Flagged Content</span>
                <span className="font-semibold text-red-600">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-green-600">120ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">System Uptime</span>
                <span className="font-semibold text-green-600">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;