import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Brain,
  AlertTriangle,
  Users
} from 'lucide-react';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const features = [
    {
      icon: <Eye className="h-8 w-8 text-blue-500" />,
      title: "Real-time Monitoring",
      description: "Monitor AI interactions in real-time with instant flagging of suspicious queries."
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-orange-500" />,
      title: "Misuse Detection",
      description: "Advanced algorithms detect potential AI misuse patterns and harmful content generation."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Emotional Analysis",
      description: "Analyze emotional context and intent behind user queries for better safety assessment."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      title: "Query Visualization",
      description: "Comprehensive dashboards showing flagged queries, patterns, and security insights."
    }
  ];

  const benefits = [
    "Reduce AI misuse by 95%",
    "Real-time threat detection",
    "Comprehensive reporting",
    "Easy integration via API",
    "Enterprise-grade security",
    "24/7 monitoring support"
  ];

  const trustedBy = [
    "TechCorp", "InnovateAI", "SafeGuard Inc", "DataSecure", "AI Solutions", "NextGen Tech"
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">Next-generation AI Safety</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Protect Your AI
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                From Misuse
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Advanced AI misuse detection platform with real-time monitoring, emotional analysis, 
              and comprehensive reporting to keep your AI systems safe and compliant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/docs"
                className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                View Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced AI Safety Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive protection suite designed to detect and prevent AI misuse across all your applications.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple integration, powerful protection. Get started in minutes with our comprehensive API.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Integrate API",
                description: "Add our lightweight SDK to your application with just a few lines of code."
              },
              {
                step: "02",
                title: "Monitor Queries",
                description: "All AI interactions are analyzed in real-time for potential misuse patterns."
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Receive detailed reports and take action on flagged content immediately."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Why Choose GuardAI?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Industry-leading AI safety platform trusted by enterprises worldwide 
                to protect their AI systems from misuse and abuse.
              </p>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-3xl"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3 text-sm font-mono">
                  <div className="text-blue-600">POST /api/analyze</div>
                  <div className="text-gray-500">{"{"}</div>
                  <div className="ml-4 text-gray-700">"query": "example text",</div>
                  <div className="ml-4 text-gray-700">"risk_level": "low",</div>
                  <div className="ml-4 text-gray-700">"confidence": 0.95</div>
                  <div className="text-gray-500">{"}"}</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Real-time API Response
                </h3>
                <p className="text-gray-600">
                  Get instant analysis results with detailed risk assessment
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-8">
            Trusted by leading companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {trustedBy.map((company, index) => (
              <div
                key={index}
                className="text-gray-400 font-medium text-lg hover:text-gray-600 transition-colors"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Secure Your AI?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of companies protecting their AI systems with GuardAI
            </p>
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">GuardAI</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Advanced AI misuse detection platform protecting your AI systems 
                with real-time monitoring and comprehensive analysis.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-3 text-gray-400">
                <Link to="#" className="block hover:text-white">Features</Link>
                <Link to="/pricing" className="block hover:text-white">Pricing</Link>
                <Link to="/docs" className="block hover:text-white">Documentation</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-3 text-gray-400">
                <Link to="#" className="block hover:text-white">About</Link>
                <Link to="#" className="block hover:text-white">Contact</Link>
                <Link to="#" className="block hover:text-white">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-12 text-center text-gray-400">
            <p>&copy; 2025 GuardAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;