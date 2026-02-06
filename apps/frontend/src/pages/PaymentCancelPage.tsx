import { useNavigate } from 'react-router-dom';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Payment Cancelled
        </h1>
        <p className="text-gray-400 mb-8">
          Your payment was cancelled. No charges were made to your account.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/pricing')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
