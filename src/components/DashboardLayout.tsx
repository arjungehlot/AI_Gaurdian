import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Eye,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  Home
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface UserData {
  name: string;
  email: string;
  role?: string;
  picture?: string;
  // Add other user properties as needed
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user data from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Real-Time Monitoring', href: '/dashboard/monitoring', icon: Eye },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Home', href: '/', icon: Home },
  ];

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    
    // Redirect to login page
    window.location.href = '/';
  };

  // Check if current page is not the dashboard overview
  const isNotOverviewPage = location.pathname !== '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span onClick={() => navigate("/")} className="text-xl font-bold cursor-pointer text-gray-900">GuardAI</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* User info in mobile sidebar */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  {/* <User className="h-5 w-5 text-white" /> */}
                   <img src={userData?.picture} alt="profileImage" className='rounded-full'/>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {userData?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userData?.role || 'Member'}
                  </div>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-6 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Logout button in mobile sidebar */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
             <span onClick={() => navigate("/")} className="text-xl font-bold cursor-pointer text-gray-900">GuardAI</span>
            </div>
          </div>
          
          {/* User info in desktop sidebar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                {/* <User className="h-5 w-5 text-white" /> */} 
                <img src={userData?.picture} alt="profileImage" className='rounded-full'/>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {userData?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500">
                  {userData?.role || 'Member'}
                </div>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-6 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Logout button in desktop sidebar */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all mt-4"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 lg:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600 lg:hidden mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Back Button - Only show on non-overview pages */}
            {isNotOverviewPage && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}
          </div>

          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search queries, reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* User profile with dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  {/* <User className="h-5 w-5 text-white" /> */}
                   <img src={userData?.picture} alt="profileImage" className='rounded-full'/>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {userData?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userData?.role || 'Member'}
                  </div>
                </div>
              </div>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {userData?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {userData?.email || ''}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;