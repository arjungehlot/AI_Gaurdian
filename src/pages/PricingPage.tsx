import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Shield, Zap, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';

const PricingPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$29',
      period: 'per month',
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 10,000 API calls/month',
        'Real-time monitoring',
        'Basic misuse detection',
        'Email notifications',
        'Standard support',
        'Basic analytics'
      ],
      cta: 'Start Free Trial',
      popular: false,
      gradient: 'from-gray-50 to-gray-100',
      border: 'border-gray-200'
    },
    {
      name: 'Pro',
      price: '$99',
      period: 'per month',
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      description: 'Advanced protection for growing companies',
      features: [
        'Up to 100,000 API calls/month',
        'Advanced emotional analysis',
        'Custom detection rules',
        'Webhook integrations',
        'Priority support',
        'Advanced analytics & reporting',
        'Team collaboration tools',
        'API rate limiting'
      ],
      cta: 'Start Free Trial',
      popular: true,
      gradient: 'from-blue-50 to-indigo-100',
      border: 'border-blue-300'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      icon: <Crown className="h-8 w-8 text-yellow-500" />,
      description: 'Complete solution for large organizations',
      features: [
        'Unlimited API calls',
        'Custom AI models',
        'On-premise deployment',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'Advanced compliance tools',
        'SLA guarantees'
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-yellow-50 to-orange-100',
      border: 'border-yellow-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Transparent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your AI safety needs. All plans include our core 
              protection features with no hidden fees.
            </p>
            <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-blue-700">
                🎉 Save 20% with annual billing
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-gradient-to-br ${plan.gradient} border-2 ${plan.border} rounded-3xl p-8 ${
                  plan.popular ? 'scale-105 shadow-2xl' : 'hover:shadow-lg'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="mb-4">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  to={plan.name === 'Enterprise' ? '#' : '/signup'}
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  q: 'What happens during the free trial?',
                  a: 'You get full access to all features of your chosen plan for 14 days. No credit card required.'
                },
                {
                  q: 'Can I change plans anytime?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.'
                },
                {
                  q: 'Is my data secure?',
                  a: 'Absolutely. We use enterprise-grade security with end-to-end encryption and SOC 2 compliance.'
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'Yes, we offer a 30-day money-back guarantee if you\'re not completely satisfied.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-20 text-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of companies protecting their AI systems with GuardAI. 
              Start your free trial today.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Free Trial
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;