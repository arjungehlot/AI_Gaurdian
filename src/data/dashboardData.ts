// Sample data for dashboard
export const dashboardStats = {
  totalQueries: 45672,
  flaggedQueries: 892,
  safeQueries: 44780,
  averageRiskScore: 0.23
};

export const realTimeQueries = [
  {
    id: 1,
    query: "How to create a secure authentication system?",
    riskLevel: "low",
    timestamp: "2025-01-02T10:45:32Z",
    flagged: false,
    confidence: 0.95,
    emotion: "neutral"
  },
  {
    id: 2,
    query: "Generate violent content for game",
    riskLevel: "high", 
    timestamp: "2025-01-02T10:43:21Z",
    flagged: true,
    confidence: 0.89,
    emotion: "concerning"
  },
  {
    id: 3,
    query: "Explain machine learning algorithms",
    riskLevel: "low",
    timestamp: "2025-01-02T10:41:15Z",
    flagged: false,
    confidence: 0.98,
    emotion: "curious"
  },
  {
    id: 4,
    query: "How to bypass security measures?",
    riskLevel: "medium",
    timestamp: "2025-01-02T10:39:08Z",
    flagged: true,
    confidence: 0.76,
    emotion: "suspicious"
  },
  {
    id: 5,
    query: "Create a marketing campaign strategy",
    riskLevel: "low",
    timestamp: "2025-01-02T10:37:45Z",
    flagged: false,
    confidence: 0.92,
    emotion: "positive"
  }
];

export const analyticsData = {
  riskLevels: [
    { name: 'Low Risk', value: 85, color: '#10B981' },
    { name: 'Medium Risk', value: 12, color: '#F59E0B' },
    { name: 'High Risk', value: 3, color: '#EF4444' }
  ],
  categories: [
    { name: 'Educational', count: 15420 },
    { name: 'Creative', count: 12850 },
    { name: 'Technical', count: 8920 },
    { name: 'Business', count: 6180 },
    { name: 'Flagged', count: 2302 }
  ],
  emotionalAnalysis: [
    { emotion: 'Neutral', percentage: 68, color: '#6B7280' },
    { emotion: 'Positive', percentage: 22, color: '#10B981' },
    { emotion: 'Curious', percentage: 7, color: '#3B82F6' },
    { emotion: 'Concerning', percentage: 3, color: '#EF4444' }
  ],
  weeklyTrends: [
    { day: 'Mon', safe: 8420, flagged: 180 },
    { day: 'Tue', safe: 9210, flagged: 220 },
    { day: 'Wed', safe: 7850, flagged: 160 },
    { day: 'Thu', safe: 9680, flagged: 240 },
    { day: 'Fri', safe: 10250, flagged: 190 },
    { day: 'Sat', safe: 6420, flagged: 120 },
    { day: 'Sun', safe: 5890, flagged: 95 }
  ]
};