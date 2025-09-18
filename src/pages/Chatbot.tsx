import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, Database, BarChart, Zap, X, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp?: Date;
  status?: 'sending' | 'sent' | 'error';
  approved?: boolean;
  analysis?: {
    safety: 'safe' | 'unsafe' | 'unknown';
    category?: string;
    severity?: number;
    reason?: string;
    gemini_response?: string;
    emotion?: {
      type: string;
      emoji: string;
    };
  };
}

const AIGuardianChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm your AI assistant. Ask me anything, and AI Guardian will check your query for safety before I receive it.",
      sender: 'bot'
    },
    {
      id: "2",
      text: "Try asking normal questions or something that might violate content policies to see how AI Guardian works.",
      sender: 'bot'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({
    totalQueries: 0,
    blockedQueries: 0,
    allowedQueries: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced safety check using your API
  const checkMessageSafety = async (text: string) => {
    try {
      const response = await fetch('/api/analyze', {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: text
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const result = data.data;
        return {
          allowed: result.safety === "safe",
          type: result.safety === "unsafe" ? "harmful" : "normal",
          category: result.category,
          severity: result.severity,
          reason: result.reason,
          gemini_response: result.gemini_response,
          emotion: result.emotion,
          analysis: {
            safety: result.safety,
            category: result.category,
            severity: result.severity,
            reason: result.reason,
            gemini_response: result.gemini_response,
            emotion: result.emotion
          }
        };
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error("API error:", error);
      return { 
        allowed: false, 
        type: 'api-error', 
        reason: 'Failed to analyze content',
        analysis: {
          safety: 'unsafe' as 'unsafe',
          category: 'API Error',
          severity: 10,
          reason: 'Failed to analyze content'
        }
      };
    }
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isProcessing) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      status: 'sending',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsProcessing(true);

    // Update message status to sent
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? {...msg, status: "sent"} : msg
      ));
    }, 500);

    // Check message safety using your API
    const checkResult = await checkMessageSafety(currentInput);
    
    // Update stats
    setStats(prev => ({
      totalQueries: prev.totalQueries + 1,
      blockedQueries: prev.blockedQueries + (checkResult.allowed ? 0 : 1),
      allowedQueries: prev.allowedQueries + (checkResult.allowed ? 1 : 0)
    }));
    
    // Add middleware message with appropriate styling based on approval
    const middlewareMessage: Message = {
      id: Date.now().toString(),
      text: checkResult.allowed 
        ? "✅ AI Guardian: Query approved. Forwarding to AI provider..." 
        : `❌ AI Guardian: Query blocked. ${checkResult.reason || "Content violates safety policies."}`,
      sender: 'system',
      timestamp: new Date(),
      approved: checkResult.allowed,
      analysis: checkResult.analysis
    };
    
    setMessages(prev => [...prev, middlewareMessage]);
    
    // If allowed, add bot response with Gemini's actual response after a delay
    if (checkResult.allowed && checkResult.gemini_response) {
      setTimeout(() => {
        const emotionEmoji = checkResult.emotion?.emoji || "😊";
        const botMessage: Message = {
          id: Date.now().toString(),
          text: `${emotionEmoji} ${checkResult.gemini_response}`,
          sender: 'bot',
          timestamp: new Date(),
          approved: true,
          analysis: checkResult.analysis
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsProcessing(false);
      }, 1500);
    } else {
      setIsProcessing(false);
    }
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hi there! I'm your AI assistant. Ask me anything, and AI Guardian will check your query for safety before I receive it.",
        sender: 'bot',
        approved: true
      },
      {
        id: "2",
        text: "Try asking normal questions or something that might violate content policies to see how AI Guardian works.",
        sender: 'bot',
        approved: true
      }
    ]);
    
    // Reset stats when clearing chat
    setStats({
      totalQueries: 0,
      blockedQueries: 0,
      allowedQueries: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        
        <Link 
          to="/"
          className="inline-flex mb-7 items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 font-medium"
        >
          ← Back to Home
        </Link>
        
        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white rounded-xl shadow-lg p-6 w-80 z-10 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <Database size={18} className="mr-2" />
                  Query Analytics
                </h3>
                <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700 font-medium">Total Queries</span>
                  <span className="text-blue-700 font-bold text-xl">{stats.totalQueries}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">Allowed</span>
                  <span className="text-green-700 font-bold text-xl">{stats.allowedQueries}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-700 font-medium">Blocked</span>
                  <span className="text-red-700 font-bold text-xl">{stats.blockedQueries}</span>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Real-time query monitoring
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-5 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="flex items-center space-x-3 z-10">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
              ></motion.div>
              <h1 className="text-xl font-bold">AI Guardian</h1>
            </div>
            <div className="flex items-center space-x-2 z-10">
              <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Middleware Active
              </div>
              <button 
                onClick={() => setShowStats(!showStats)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                title="View analytics"
              >
                <BarChart size={16} />
              </button>
              <button 
                onClick={handleClearChat}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                title="Clear chat"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          
          {/* Chat container */}
          <div className="h-96 p-5 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 relative ${message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-md' 
                      : message.sender === 'system' 
                        ? message.approved 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-900 border border-green-200 shadow-sm' 
                          : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-900 border border-red-200 shadow-sm'
                        : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-bl-none shadow-sm'}`}>
                      
                      {message.sender === 'system' && (
                        <div className={`absolute -top-2 -left-2 bg-white rounded-full p-1 shadow-md border ${
                          message.approved ? 'border-green-200' : 'border-red-200'
                        }`}>
                          {message.approved ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <XCircle size={14} className="text-red-600" />
                          )}
                        </div>
                      )}
                      
                      {message.status === 'sending' ? (
                        <div className="flex items-center">
                          <div className="flex space-x-1 mr-2">
                            <div className="w-2 h-2 bg-current rounded-full opacity-60 animate-bounce"></div>
                            <div className="w-2 h-2 bg-current rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <>
                          {message.sender === 'system' && (
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-semibold">AI Guardian</span>
                            </div>
                          )}
                          <p className="whitespace-pre-line">{message.text}</p>
                          {message.timestamp && (
                            <p className="text-[10px] opacity-70 mt-1 text-right">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isProcessing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <div className="flex items-center">
                      <span className="mr-2">AI Guardian is analyzing</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full opacity-60 animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef}></div>
            </div>
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing}
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all shadow-md"
                onClick={handleSendMessage}
                disabled={isProcessing || inputText.trim() === ''}
              >
                {isProcessing ? (
                  <div className="flex space-x-0.5">
                    <div className="w-1 h-1 bg-white rounded-full opacity-60 animate-bounce"></div>
                    <div className="w-1 h-1 bg-white rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-white rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                ) : (
                  <Send size={18} />
                )}
              </motion.button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 text-center flex justify-center items-center">
              <Zap size={14} className="mr-1" />
              Try: "What's the weather?" (normal) or "How to hack a website?" (blocked)
            </div>
          </div>
        </motion.div>
         
      </div>
    </div>
  );
};

export default AIGuardianChatDemo;