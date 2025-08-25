import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Download,
  RefreshCw,
  AlertCircle,
  Shield,
  Zap,
  Activity,
  Smile,
  Frown,
  Meh,
  Heart,
} from "lucide-react";

// Define TypeScript interfaces for our data
interface RiskLevel {
  name: string;
  value: number;
  color: string;
}

interface Category {
  name: string;
  count: number;
}

interface Emotion {
  emotion: string;
  color: string;
  percentage: number;
  icon: JSX.Element;
}

interface WeeklyTrend {
  day: string;
  safe: number;
  flagged: number;
}

interface AnalyticsData {
  safetyRate: number;
  weekGrowth: number;
  avgResponse: number;
  riskRate: number;
  riskLevels: RiskLevel[];
  categories: Category[];
  emotionalAnalysis: Emotion[];
  weeklyTrends: WeeklyTrend[];
  totalQueries: number;
  flaggedQueries: number;
}

// Emotion icons mapping
const emotionIcons: Record<string, JSX.Element> = {
  Positive: <Smile className="h-5 w-5" />,
  Negative: <Frown className="h-5 w-5" />,
  Neutral: <Meh className="h-5 w-5" />,
  Happy: <Smile className="h-5 w-5" />,
  Angry: <Frown className="h-5 w-5" />,
  Romantic: <Heart className="h-5 w-5" />,
  Sarcastic: <Zap className="h-5 w-5" />,
};

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Simulate API call with a timeout to demonstrate loading states
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for demonstration
      const mockData: AnalyticsData = {
        safetyRate: 92,
        weekGrowth: 12.5,
        avgResponse: 342,
        riskRate: 8,
        riskLevels: [
          { name: "Low", value: 65, color: "#10B981" },
          { name: "Medium", value: 20, color: "#F59E0B" },
          { name: "High", value: 10, color: "#EF4444" },
          { name: "Critical", value: 5, color: "#7C3AED" },
        ],
        categories: [
          { name: "Technology", count: 1245 },
          { name: "Health", count: 876 },
          { name: "Finance", count: 754 },
          { name: "Education", count: 632 },
          { name: "Entertainment", count: 521 },
        ],
        emotionalAnalysis: [
          { emotion: "Happy", color: "#10B981", percentage: 42, icon: emotionIcons.Happy },
          { emotion: "Neutral", color: "#6366F1", percentage: 25, icon: emotionIcons.Neutral },
          { emotion: "Sarcastic", color: "#F59E0B", percentage: 15, icon: emotionIcons.Sarcastic },
          { emotion: "Romantic", color: "#EC4899", percentage: 10, icon: emotionIcons.Romantic },
          { emotion: "Angry", color: "#EF4444", percentage: 8, icon: emotionIcons.Angry },
        ],
        weeklyTrends: [
          { day: "Mon", safe: 120, flagged: 8 },
          { day: "Tue", safe: 145, flagged: 12 },
          { day: "Wed", safe: 132, flagged: 10 },
          { day: "Thu", safe: 158, flagged: 14 },
          { day: "Fri", safe: 167, flagged: 15 },
          { day: "Sat", safe: 142, flagged: 11 },
          { day: "Sun", safe: 115, flagged: 9 },
        ],
        totalQueries: 45672,
        flaggedQueries: 892
      };

      setAnalyticsData(mockData);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleExport = () => {
    // In a real application, this would generate and download a report
    console.log("Exporting analytics data...");
    // Mock export functionality
    alert("Export functionality would download a CSV/PDF report in a real application");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-blue-600" />
        </motion.div>
        <p className="mt-4 text-gray-600">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
        <p className="text-gray-600 mt-2 mb-6">{error}</p>
        <button
          onClick={() => fetchAnalytics()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return null; // This should not happen due to loading state, but for TypeScript safety
  }

  const { riskLevels, categories, emotionalAnalysis, weeklyTrends, totalQueries, flaggedQueries } = analyticsData;

  // Calculate data for pie chart
  const safeQueries = totalQueries - flaggedQueries;
  // const pieChartData = [
  //   { name: 'Safe', value: safeQueries, color: '#10B981' },
  //   { name: 'Flagged', value: flaggedQueries, color: '#EF4444' }
  // ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive analysis of AI query patterns and safety metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Safety Rate",
            value: `${analyticsData.safetyRate}%`,
            description: "Queries flagged as safe",
            icon: <Shield className="h-6 w-6 text-blue-500" />,
            bg: "bg-blue-50",
            trend: "positive",
            trendValue: "2.3%",
          },
          {
            title: "Week Growth",
            value: `${analyticsData.weekGrowth}%`,
            description: "Increase in total queries",
            icon: <TrendingUp className="h-6 w-6 text-green-500" />,
            bg: "bg-green-50",
            trend: "positive",
            trendValue: "12.5%",
          },
          {
            title: "Avg Response",
            value: `${analyticsData.avgResponse}ms`,
            description: "Average response time",
            icon: <Zap className="h-6 w-6 text-purple-500" />,
            bg: "bg-purple-50",
            trend: "negative",
            trendValue: "5.2%",
          },
          {
            title: "Risk Rate",
            value: `${analyticsData.riskRate}%`,
            description: "Queries requiring review",
            icon: <Activity className="h-6 w-6 text-red-500" />,
            bg: "bg-red-50",
            trend: "negative",
            trendValue: "1.8%",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${card.bg} rounded-xl`}>{card.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm font-medium text-gray-900">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              </div>
              <div className={`text-xs font-medium ${card.trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {card.trendValue}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid - 2 columns layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Bar Chart - Top Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2 text-blue-500" />
            Query Categories
          </h3>
          <div className="space-y-4 h-80 overflow-y-auto">
            {categories.map((category: Category, index) => {
              const maxCount = Math.max(...categories.map((c: Category) => c.count));
              const percentage = (category.count / maxCount) * 80; // 80% max width for visual appeal
              
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.count.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                    ></motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Risk Chart - Top Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="h-6 w-6 mr-2 text-red-500" />
            Risk Distribution
          </h3>
          <div className="space-y-4">
            {riskLevels.map((level: RiskLevel, index) => (
              <div key={level.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: level.color }}
                  ></div>
                  <span className="text-gray-700 font-medium">{level.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${level.value}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-2.5 rounded-full"
                      style={{ backgroundColor: level.color }}
                    ></motion.div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {level.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Emotion Analysis - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Smile className="h-6 w-6 mr-2 text-yellow-500" />
            Emotional Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emotionalAnalysis.map((emotion: Emotion, index) => (
              <motion.div
                key={emotion.emotion}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${emotion.color}20` }}
                >
                  <div style={{ color: emotion.color }}>
                    {emotion.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{emotion.emotion}</span>
                    <span className="text-sm font-medium text-gray-900">{emotion.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${emotion.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: emotion.color }}
                    ></motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pie Chart - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <PieChart className="h-6 w-6 mr-2 text-green-500" />
            Query Safety Status
          </h3>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-40 h-40 mb-6">
              {/* Pie chart visualization */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
              <motion.div
                initial={{ rotate: 0, clipPath: 'inset(0 0 0 100%)' }}
                animate={{ 
                  rotate: 360,
                  clipPath: `inset(0 0 0 ${100 - (safeQueries / totalQueries) * 100}%)`
                }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 rounded-full border-8 border-green-500"
                style={{ 
                  clipPath: `inset(0 0 0 ${100 - (safeQueries / totalQueries) * 100}%)`,
                  transform: 'rotate(90deg)'
                }}
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.safetyRate}%</div>
                  <div className="text-sm text-gray-500">Safe</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Safe: {safeQueries.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Flagged: {flaggedQueries.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Line Chart - Full Width at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-purple-500" />
          Weekly Query Trends
        </h3>
        <div className="h-64">
          <div className="flex items-end justify-between h-48 mb-4">
            {weeklyTrends.map((day: WeeklyTrend, index) => {
              const maxValue = Math.max(...weeklyTrends.map(d => d.safe + d.flagged));
              const safeHeight = (day.safe / maxValue) * 100;
              const flaggedHeight = (day.flagged / maxValue) * 100;
              
              return (
                <div key={day.day} className="flex flex-col items-center flex-1 mx-1">
                  <div className="flex items-end justify-center h-40 w-full">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${safeHeight}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="w-3/5 bg-green-500 rounded-t"
                    ></motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${flaggedHeight}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                      className="w-3/5 bg-red-500 rounded-t"
                    ></motion.div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Safe Queries</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Flagged Queries</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;