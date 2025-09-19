import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Chrome, Github, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

// ✅ Import Google Identity
import { jwtDecode } from 'jwt-decode';

// Add global type for google
declare global {
  interface Window {
    google?: any;
  }
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // ✅ Google Client ID
  const GOOGLE_CLIENT_ID = "1027632097229-17odhk6cb1ff52stg13g840re052cngn.apps.googleusercontent.com";

  // Clear messages when switching between login/register
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isLogin]);

  // Check if passwords match when confirmPassword changes
  useEffect(() => {
    if (!isLogin && formData.password && formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword, isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error) setError('');
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setPasswordsMatch(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin 
        ? 'https://ai-gaurdian-back.onrender.com/api/v1/users/login' 
        : 'https://ai-gaurdian-back.onrender.com/api/v1/users/register';

      const requestData = isLogin
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 1500);
        } else {
          setSuccess('Registration successful! You can now login.');
          setTimeout(() => toggleForm(), 2000);
        }
      } else {
        setError(data.message || `An error occurred during ${isLogin ? 'login' : 'registration'}`);
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Google Login handler
  const handleGoogleResponse = (response: any) => {
    try {
      const decoded: any = jwtDecode(response.credential);
      console.log("Google User:", decoded);

      // Example: send Google token to backend for verification
      localStorage.setItem('accessToken', response.credential);
      localStorage.setItem('user', JSON.stringify(decoded));

      setSuccess('Google login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Please try again.");
    }
  };

  // ✅ Load Google One-Tap script
  useEffect(() => {
    const initializeGoogle = () => {
      /* global google */
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleBtn")!,
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full flex flex-col justify-center"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  AIGuardian
                </span>
              </Link>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to your account to continue' : 'Join us to secure your AI systems'}
              </p>
            </div>

            {/* Error and Success */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ✅ Google Login Button */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div id="googleBtn"></div>
              <button 
                onClick={() => setError("GitHub login not implemented yet")}
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Github className="h-5 w-5 text-gray-800" />
                <span className="text-sm font-medium text-gray-700">GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="username"
                        type="text"
                        required={!isLogin}
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Username"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Email address"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Confirm Password */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required={!isLogin}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          formData.confirmPassword && !passwordsMatch 
                            ? 'border-red-500' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Confirm Password"
                      />
                      {formData.confirmPassword && !passwordsMatch && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link to="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Forgot password?
                  </Link>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || (!isLogin && !passwordsMatch)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={toggleForm}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 50%),
                              radial-gradient(circle at 75px 75px, white 2%, transparent 50%)`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>
          <div className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <img 
              src="https://courses.iid.org.in/public/frontend/images/register.png" 
              alt="AI Security Illustration"
              className="w-full max-w-md rounded-xl"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                if (img.nextSibling && (img.nextSibling as HTMLElement).style) {
                  (img.nextSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <div className="hidden flex-col items-center justify-center text-center text-white">
              <Shield className="h-24 w-24 mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">AI Security</h3>
              <p className="opacity-80">Advanced protection against AI misuse</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
