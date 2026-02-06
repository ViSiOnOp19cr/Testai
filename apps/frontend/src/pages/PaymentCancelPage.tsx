import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border-2 border-yellow-200 rounded-xl p-8 text-center shadow-lg">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-yellow-600"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
