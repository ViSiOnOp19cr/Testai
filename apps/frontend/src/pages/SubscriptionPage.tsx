import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
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
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600 text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  const usagePercentage = subscription
    ? (subscription.quota.used / subscription.quota.limit) * 100
    : 0;

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
            <p className="mt-2 text-gray-600">
              Manage your subscription, view usage, and upgrade your plan
            </p>
          </div>

          {/* Subscription Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {subscription?.plan.toUpperCase()} Plan
                </h2>
                <p className="text-gray-600">
                  Status:{' '}
                  <span className="text-green-600 font-semibold">
                    {subscription?.status}
                  </span>
                </p>
                {subscription?.renewalDate && (
                  <p className="text-gray-600 mt-1">
                    Renews on: {new Date(subscription.renewalDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
              >
                Upgrade Plan
              </button>
            </div>

            {/* Usage Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">API Usage This Month</span>
                <span className="text-gray-900 font-semibold">
                  {subscription?.quota.used} / {subscription?.quota.limit} requests
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
              <p className="text-gray-500 text-sm mt-2">
                {subscription?.quota.remaining} requests remaining
              </p>
            </div>

            {/* Cancel Button */}
            {subscription?.plan !== 'free' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-red-600 hover:text-red-700 text-sm font-semibold disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            )}
          </div>

          {/* Usage Stats */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Usage Details</h2>

            {usage?.usage.length > 0 ? (
              <div className="space-y-4">
                {usage.usage.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div>
                      <p className="text-gray-900 font-semibold">{item.endpoint}</p>
                      <p className="text-gray-500 text-sm">
                        Last used: {new Date(item.last_used).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#ff6b35]">{item.count}</p>
                      <p className="text-gray-500 text-sm">requests</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No usage data for this month</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
