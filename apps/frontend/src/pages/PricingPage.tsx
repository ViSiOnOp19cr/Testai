import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import * as paymentService from '../services/paymentService';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    requests: 10,
    features: ['10 API requests/month', 'Basic support', 'Community access'],
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    requests: 100,
    features: ['100 API requests/month', 'Priority support', 'Advanced features'],
    popular: true,
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 499,
    requests: 250,
    features: ['250 API requests/month', '24/7 support', 'All features unlocked'],
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await paymentService.getSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const handleUpgrade = async (planType: 'pro' | 'ultra') => {
    setLoading(planType);
    try {
      const { checkoutUrl } = await paymentService.createCheckout(planType);
      // Redirect to Dodo checkout
      window.location.href = checkoutUrl;
    } catch (error: any) {
      alert(error.message || 'Failed to create checkout');
      setLoading(null);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600">
              Simple, transparent pricing for everyone
            </p>
            {subscription && (
              <div className="mt-4 inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <p className="text-blue-800">
                  Current Plan: <span className="font-bold">{subscription.plan}</span>
                  {' • '}
                  {subscription.quota.remaining} of {subscription.quota.limit} requests remaining
                </p>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white border-2 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow ${
                  plan.popular
                    ? 'border-[#ff6b35] shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#ff6b35] to-[#ff8555] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">₹{plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-600">/month</span>}
                </div>

                {/* Requests */}
                <p className="text-gray-700 mb-6 font-medium">
                  <span className="font-bold text-gray-900">{plan.requests}</span> API requests per month
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {plan.id === 'free' ? (
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id as 'pro' | 'ultra')}
                    disabled={loading === plan.id}
                    className={`w-full py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? 'bg-[#ff6b35] hover:bg-[#e55a2b] text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {loading === plan.id ? 'Loading...' : 'Upgrade Now'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <button
              onClick={() => navigate('/subscription')}
              className="text-[#ff6b35] hover:text-[#e55a2b] font-semibold"
            >
              ← Back to Billing
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
