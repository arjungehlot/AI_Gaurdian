import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye
} from 'lucide-react';

const RealTimeMonitoring = () => {
  const [queries, setQueries] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [isLive, setIsLive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch queries from API
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/records");
      const json = await res.json();
      if (json.success) {
        // Map API response into your UI query format
        const mapped = json.data.map((item: any) => ({
          id: item._id,
          query: item.prompt,
          riskLevel: item.severity >= 7 ? "high" : item.severity >= 4 ? "medium" : "low",
          timestamp: item.createdAt,
          flagged: item.safety === "unsafe",
          confidence: Math.max(0.5, 1 - item.severity / 10), // fake confidence based on severity
          emotion: item.emotion?.type || "neutral"
        }));
        setQueries(mapped.reverse()); // newest first
      }
    } catch (error) {
      console.error("Failed to fetch queries:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + refresh every 10s when live
  useEffect(() => {
    fetchQueries();
    if (!isLive) return;

    const interval = setInterval(() => {
      fetchQueries();
    }, 10000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Filtering logic
  const filteredQueries = queries.filter(query => {
    switch (filter) {
      case 'flagged':
        return query.flagged;
      case 'safe':
        return !query.flagged;
      case 'high-risk':
        return query.riskLevel === 'high';
      case 'medium-risk':
        return query.riskLevel === 'medium';
      default:
        return true;
    }
  });

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Monitoring</h1>
          <p className="text-gray-600 mt-2">Live feed of AI query analysis and safety detection</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
              isLive 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isLive ? 'Live' : 'Paused'}</span>
          </button>
          <button 
            onClick={fetchQueries}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search queries..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Queries</option>
            <option value="flagged">Flagged Only</option>
            <option value="safe">Safe Only</option>
            <option value="high-risk">High Risk</option>
            <option value="medium-risk">Medium Risk</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredQueries.length}</p>
              <p className="text-sm text-gray-600">Total Queries</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-50 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {filteredQueries.filter(q => q.flagged).length}
              </p>
              <p className="text-sm text-gray-600">Flagged</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {filteredQueries.filter(q => !q.flagged).length}
              </p>
              <p className="text-sm text-gray-600">Safe</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-xl">
              <Clock className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">125ms</p>
              <p className="text-sm text-gray-600">Avg Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Query Feed */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Live Query Feed</h2>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Fetching live data...</p>
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="p-12 text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No queries match your current filter</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredQueries.map((query, index) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${
                    query.flagged ? 'border-red-500' : 'border-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadge(query.riskLevel)}`}>
                          {query.riskLevel.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmotionBadge(query.emotion)}`}>
                          {query.emotion}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(query.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-2">{query.query}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>ID: {query.id}</span>
                        <span>Confidence: {(query.confidence * 100).toFixed(1)}%</span>
                        <span className={query.flagged ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                          {query.flagged ? 'FLAGGED' : 'SAFE'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {query.flagged && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
