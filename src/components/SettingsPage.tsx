import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key,
  Bell,
  Shield,
  User,
  Sliders,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  Save
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    highRisk: true,
    mediumRisk: false,
    weeklyReports: true,
    monthlyReports: true,
    systemAlerts: true
  });

  const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Sliders }
  ];

  const apiKeys = [
    {
      id: 1,
      name: 'Production API Key',
      key: 'sk_prod_1234567890abcdef',
      created: '2024-12-15',
      lastUsed: '2025-01-02',
      usage: 45672
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'sk_dev_abcdef1234567890',
      created: '2024-11-20',
      lastUsed: '2025-01-01',
      usage: 12450
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account, API keys, and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl border border-gray-200 p-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all mb-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="john.doe@company.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      defaultValue="TechCorp Inc."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Administrator</option>
                      <option>Developer</option>
                      <option>Manager</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* API Keys */}
            {activeTab === 'api' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <Plus className="h-4 w-4" />
                      <span>Create New Key</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">{key.name}</h3>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm font-mono">
                              {showApiKey ? key.key : '••••••••••••••••••••••••••••••••'}
                            </code>
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="block font-medium">Created</span>
                              <span>{key.created}</span>
                            </div>
                            <div>
                              <span className="block font-medium">Last Used</span>
                              <span>{key.lastUsed}</span>
                            </div>
                            <div>
                              <span className="block font-medium">Usage</span>
                              <span>{key.usage.toLocaleString()} calls</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800 mb-1">Keep your API keys secure</h3>
                      <p className="text-amber-700 text-sm">
                        Don't share your API keys in publicly accessible areas such as GitHub, 
                        client-side code, and so forth. Treat your API keys like passwords.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Security Alerts</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'highRisk', label: 'High Risk Queries', description: 'Immediate alerts for high-risk content detection' },
                        { key: 'mediumRisk', label: 'Medium Risk Queries', description: 'Notifications for medium-risk content' },
                        { key: 'systemAlerts', label: 'System Alerts', description: 'System status and maintenance notifications' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }))}
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <label className="text-sm font-medium text-gray-900">{item.label}</label>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Reports</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly summary of AI safety metrics' },
                        { key: 'monthlyReports', label: 'Monthly Reports', description: 'Comprehensive monthly analysis reports' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }))}
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <label className="text-sm font-medium text-gray-900">{item.label}</label>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <Save className="h-4 w-4" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
                    <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Enable 2FA</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Session Management</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Current Session</p>
                          <p className="text-sm text-gray-600">Chrome on MacOS • Last active now</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Current</span>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">Previous Session</p>
                          <p className="text-sm text-gray-600">Safari on iPhone • 2 hours ago</p>
                        </div>
                        <button className="text-red-600 hover:text-red-700 text-sm">Revoke</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dashboard Theme
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Auto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European Time)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Report Format
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>CSV</option>
                      <option>XLSX</option>
                      <option>PDF</option>
                      <option>JSON</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                      <Save className="h-4 w-4" />
                      <span>Save Preferences</span>
                    </button>
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

export default SettingsPage;