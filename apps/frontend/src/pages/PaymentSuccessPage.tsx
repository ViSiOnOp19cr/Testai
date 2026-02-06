import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-500"
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
        <h1 className="text-3xl font-bold text-white mb-3">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-400 mb-8">
          Your subscription has been activated successfully. Welcome to the premium experience!
        </p>

        {/* Countdown */}
        <p className="text-gray-500 text-sm mb-6">
          Redirecting to your subscription dashboard in {countdown} seconds...
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/subscription')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            View Subscription
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
