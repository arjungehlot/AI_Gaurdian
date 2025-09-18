import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  picture?: string;
  userData?: string;
}

// const userData = localStorage.getItem('user');

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith('/dashboard');


  // Check if user is logged in on component mount and on location change
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token) {
        setAccessToken(token);
      } else {
        setAccessToken(null);
      }
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Validate that the parsed data has the expected structure
          if (parsedUser && typeof parsedUser.name === 'string' && typeof parsedUser.email === 'string') {
            setUser(parsedUser);
          } else {
            console.error('Invalid user data structure');
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Check auth status on component mount and when location changes
    checkAuthStatus();

    // Listen for storage changes to update auth status
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'accessToken' || e.key === 'authToken') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]); // Re-run when location changes

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    setUser(null);
    setAccessToken(null);
    setUserMenuOpen(false);
    if (isDashboard) {
      navigate('/');
    }
  };

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Docs', href: '/docs' },
    { name: 'Chat', href: '/chat' },
  ];

  // Don't show navbar on dashboard if user is not logged in
  if (isDashboard && !user && !accessToken) return null;

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AIGuardian</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                     <img src={user?.picture} alt="profileImage" className='rounded-full'/>
                  </div>
                  <span className="text-gray-700 font-medium">Hey, {user.name.split(' ')[0]}!</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {!isDashboard && (
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      )}
                      
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/chat"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 border-t border-gray-100"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <hr className="border-gray-100" />
                
                {user ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">Signed in as</p>
                      <p className="text-sm text-gray-600">{user.name}</p>
                    </div>
                    
                    {!isDashboard && (
                      <Link
                        to="/dashboard"
                        className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 flex items-center"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    )}
                    
                    <Link
                      to="/settings"
                      className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2 flex items-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 font-medium px-4 py-2 flex items-center text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-blue-600 font-medium px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/chat"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl mx-4 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;