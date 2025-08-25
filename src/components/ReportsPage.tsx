import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
 
  FileText, 
  Filter,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const ReportsPage = () => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('last-30-days');

  const reports = [
    {
      id: 1,
      name: 'Weekly Safety Report',
      type: 'Safety Analysis',
      date: '2025-01-02',
      queries: 12450,
      flagged: 234,
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Monthly Risk Assessment',
      type: 'Risk Analysis',
      date: '2025-01-01',
      queries: 45672,
      flagged: 892,
      format: 'XLSX',
      size: '5.1 MB'
    },
    {
      id: 3,
      name: 'Emotional Analysis Summary',
      type: 'Emotional Analysis',
      date: '2024-12-30',
      queries: 8920,
      flagged: 156,
      format: 'CSV',
      size: '1.8 MB'
    },
    {
      id: 4,
      name: 'API Usage Report',
      type: 'Usage Statistics',
      date: '2024-12-29',
      queries: 23450,
      flagged: 445,
      format: 'JSON',
      size: '3.2 MB'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate and download comprehensive analysis reports</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          <Download className="h-5 w-5" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Report Generator */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Custom Report</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Safety Analysis</option>
              <option>Risk Assessment</option>
              <option>Emotional Analysis</option>
              <option>Usage Statistics</option>
              <option>Custom Report</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select 
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="csv">CSV</option>
              <option value="xlsx">XLSX</option>
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all">
              <Download className="h-4 w-4" />
              <span>Generate</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-xl">
              <Eye className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">45,672</p>
            <p className="text-sm text-gray-600">Total Queries Analyzed</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-red-50 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">892</p>
            <p className="text-sm text-gray-600">Flagged Queries</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">98.1%</p>
            <p className="text-sm text-gray-600">Safety Rate</p>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4" />
                <span className="text-sm">Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Report Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Queries</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Flagged</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Format</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Size</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {report.queries.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-red-600">
                      {report.flagged.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Download
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-gray-600 hover:text-gray-700 text-sm">
                        View
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;