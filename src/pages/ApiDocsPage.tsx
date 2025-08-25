import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Key, 
  Search, 
  FileText, 
  Copy, 
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const ApiDocsPage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('authentication');
  const [expandedSections, setExpandedSections] = useState<string[]>(['authentication']);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sidebarItems = [
    {
      title: 'Authentication',
      id: 'authentication',
      icon: <Key className="h-5 w-5" />,
      items: [
        'API Keys',
        'Bearer Token',
        'Rate Limits'
      ]
    },
    {
      title: 'Analyze Query',
      id: 'analyze',
      icon: <Search className="h-5 w-5" />,
      items: [
        'POST /analyze',
        'Request Format',
        'Response Format'
      ]
    },
    {
      title: 'Reports',
      id: 'reports',
      icon: <FileText className="h-5 w-5" />,
      items: [
        'GET /reports',
        'Filter Options',
        'Export Formats'
      ]
    }
  ];

  const codeExamples = {
    authentication: `// API Authentication
const apiKey = 'your-api-key-here';
const headers = {
  'Authorization': \`Bearer \${apiKey}\`,
  'Content-Type': 'application/json'
};`,
    analyzeRequest: `// Analyze Query Request
const response = await fetch('https://api.guardai.com/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: "Generate a story about AI robots",
    options: {
      includeEmotionalAnalysis: true,
      detectIntent: true
    }
  })
});`,
    analyzeResponse: `// Analyze Query Response
{
  "id": "analysis-12345",
  "query": "Generate a story about AI robots",
  "riskLevel": "low",
  "confidence": 0.92,
  "categories": ["creative", "fiction"],
  "flags": [],
  "emotionalAnalysis": {
    "dominant": "neutral",
    "confidence": 0.85,
    "emotions": {
      "positive": 0.7,
      "neutral": 0.85,
      "negative": 0.1
    }
  },
  "timestamp": "2025-01-02T10:30:00Z"
}`,
    reportsRequest: `// Get Reports
const response = await fetch('https://api.guardai.com/v1/reports?date_from=2025-01-01&date_to=2025-01-31', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
  }
});`
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-16 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">API Documentation</h1>
            </div>
          </div>

          <div className="p-6">
            <nav className="space-y-2">
              {sidebarItems.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      toggleSection(section.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                    </div>
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {expandedSections.includes(section.id) && (
                    <div className="ml-6 mt-2 space-y-1">
                      {section.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-600 py-2 px-3 hover:text-blue-600 cursor-pointer"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-80">
          <div className="max-w-4xl mx-auto p-8">
            {/* Authentication Section */}
            {activeSection === 'authentication' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Authentication</h1>
                
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Keys</h2>
                    <p className="text-gray-600 mb-6">
                      GuardAI uses API keys to authenticate requests. You can view and manage your API keys 
                      in the GuardAI Dashboard. Your API keys carry many privileges, so be sure to keep them secure!
                    </p>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm font-bold">!</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-amber-800 mb-1">Keep your API key secure</h3>
                          <p className="text-amber-700 text-sm">
                            Do not share your secret API keys in publicly accessible areas such as GitHub, 
                            client-side code, and so forth.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(codeExamples.authentication, 'auth')}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === 'auth' ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        <code>{codeExamples.authentication}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rate Limits</h2>
                    <p className="text-gray-600 mb-4">
                      The GuardAI API has rate limits to prevent abuse and ensure fair usage:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-2">Basic</h3>
                        <p className="text-2xl font-bold text-blue-600 mb-1">100</p>
                        <p className="text-gray-600 text-sm">requests per minute</p>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-2">Pro</h3>
                        <p className="text-2xl font-bold text-purple-600 mb-1">1,000</p>
                        <p className="text-gray-600 text-sm">requests per minute</p>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-2">Enterprise</h3>
                        <p className="text-2xl font-bold text-yellow-600 mb-1">Custom</p>
                        <p className="text-gray-600 text-sm">contact sales</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analyze Query Section */}
            {activeSection === 'analyze' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Analyze Query</h1>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">POST</span>
                      <code className="text-lg font-mono text-gray-900">/v1/analyze</code>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Analyze a query for potential AI misuse, emotional context, and safety risks.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Example</h3>
                    <div className="bg-gray-900 rounded-xl p-6 relative mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(codeExamples.analyzeRequest, 'request')}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === 'request' ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        <code>{codeExamples.analyzeRequest}</code>
                      </pre>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Response Example</h3>
                    <div className="bg-gray-900 rounded-xl p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(codeExamples.analyzeResponse, 'response')}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === 'response' ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        <code>{codeExamples.analyzeResponse}</code>
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Parameters</h3>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Parameter</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 text-sm font-mono text-gray-900">query</td>
                            <td className="px-6 py-4 text-sm text-gray-600">string</td>
                            <td className="px-6 py-4 text-sm text-gray-600">The text to analyze (required)</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 text-sm font-mono text-gray-900">options</td>
                            <td className="px-6 py-4 text-sm text-gray-600">object</td>
                            <td className="px-6 py-4 text-sm text-gray-600">Additional analysis options (optional)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reports Section */}
            {activeSection === 'reports' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Reports</h1>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">GET</span>
                      <code className="text-lg font-mono text-gray-900">/v1/reports</code>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Retrieve analysis reports and export data in various formats.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Example</h3>
                    <div className="bg-gray-900 rounded-xl p-6 relative mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(codeExamples.reportsRequest, 'reports')}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === 'reports' ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        <code>{codeExamples.reportsRequest}</code>
                      </pre>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Export Formats</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">JSON</h4>
                        <p className="text-gray-600 text-sm mb-3">Structured data format for API integration</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">format=json</code>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">CSV</h4>
                        <p className="text-gray-600 text-sm mb-3">Spreadsheet format for data analysis</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">format=csv</code>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">XLSX</h4>
                        <p className="text-gray-600 text-sm mb-3">Excel format with advanced formatting</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">format=xlsx</code>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocsPage;