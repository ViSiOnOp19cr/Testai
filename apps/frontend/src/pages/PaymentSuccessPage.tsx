import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/subscription');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border-2 border-green-200 rounded-xl p-8 text-center shadow-lg">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-8">
            Your subscription has been activated successfully. Welcome to the premium experience!
          </p>

          {/* Countdown */}
          <p className="text-gray-500 text-sm mb-6">
            Redirecting to your billing dashboard in {countdown} seconds...
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/subscription')}
              className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
            >
              View Subscription
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
