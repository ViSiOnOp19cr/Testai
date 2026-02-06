import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paymentService from '../services/paymentService';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subData, usageData] = await Promise.all([
        paymentService.getSubscription(),
        paymentService.getUsage(),
      ]);
      setSubscription(subData);
      setUsage(usageData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    setCancelling(true);
    try {
      await paymentService.cancelSubscription();
      alert('Subscription cancelled successfully');
      loadData(); // Reload data
    } catch (error: any) {
      alert(error.message || 'Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const usagePercentage = subscription
    ? (subscription.quota.used / subscription.quota.limit) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-8">Subscription & Usage</h1>

        {/* Subscription Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {subscription?.plan.toUpperCase()} Plan
              </h2>
              <p className="text-gray-400">
                Status: <span className="text-green-400 font-semibold">{subscription?.status}</span>
              </p>
              {subscription?.renewalDate && (
                <p className="text-gray-400 mt-1">
                  Renews on: {new Date(subscription.renewalDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Upgrade Plan
            </button>
          </div>

          {/* Usage Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">API Usage This Month</span>
              <span className="text-white font-semibold">
                {subscription?.quota.used} / {subscription?.quota.limit} requests
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercentage > 80
                    ? 'bg-red-500'
                    : usagePercentage > 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {subscription?.quota.remaining} requests remaining
            </p>
          </div>

          {/* Cancel Button */}
          {subscription?.plan !== 'free' && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-red-400 hover:text-red-300 text-sm font-semibold disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
        </div>

        {/* Usage Stats */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Usage Details</h2>
          
          {usage?.usage.length > 0 ? (
            <div className="space-y-4">
              {usage.usage.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-700 pb-4 last:border-0"
                >
                  <div>
                    <p className="text-white font-semibold">{item.endpoint}</p>
                    <p className="text-gray-400 text-sm">
                      Last used: {new Date(item.last_used).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-400">{item.count}</p>
                    <p className="text-gray-400 text-sm">requests</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No usage data for this month</p>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
