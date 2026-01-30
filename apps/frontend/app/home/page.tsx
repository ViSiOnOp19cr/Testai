'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, getApiKeys } from '../services/authService';
import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import CodeBlock from '../components/CodeBlock';

interface ApiKey {
  id: string;
  apiKey: string;
  prefix: string;
  createdAt: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [apiKeysCount, setApiKeysCount] = useState<number>(0);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (user?.email) {
        setIsLoadingKeys(true);
        try {
          const keys = await getApiKeys(user.email);
          setApiKeysCount(keys.length);
        } catch (error) {
          console.error('Failed to fetch API keys:', error);
        } finally {
          setIsLoadingKeys(false);
        }
      }
    };

    fetchApiKeys();
  }, [user]);

  if (!user) {
    return null; // Layout component handles loading state
  }

  const installCode = `npm install tstai`;
  
  const usageCode = `import { testApi } from 'tstai';

testApi({
  apiKey: 'your-api-key',
  endpoint: 'https://api.example.com/login',
  test: 'Check if user login works with valid credentials'
});`;

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-[#ff6b35]">Tstai</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            API testing made simple with the power of AI - No coding required
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#ff6b35] hover:bg-[#e55a2b] transition-colors shadow-md"
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              View Docs
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Plan</p>
                <p className="text-2xl font-bold text-gray-900">{user.plan}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">API Keys</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingKeys ? '...' : apiKeysCount}
                </p>
              </div>
              <div className="text-4xl">🔑</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/projects"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-[#ff6b35] transition-all"
            >
              <div className="text-3xl mr-4">🔑</div>
              <div>
                <h3 className="font-semibold text-gray-900">Create API Key</h3>
                <p className="text-sm text-gray-600">Generate a new API key</p>
              </div>
            </Link>
            <Link
              href="/docs"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-[#ff6b35] transition-all"
            >
              <div className="text-3xl mr-4">📚</div>
              <div>
                <h3 className="font-semibold text-gray-900">Read Documentation</h3>
                <p className="text-sm text-gray-600">Learn how to use Tstai</p>
              </div>
            </Link>
            <Link
              href="/projects"
              className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-[#ff6b35] transition-all"
            >
              <div className="text-3xl mr-4">⚡</div>
              <div>
                <h3 className="font-semibold text-gray-900">View Projects</h3>
                <p className="text-sm text-gray-600">Manage your API keys</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Installation & Usage */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Install Tstai</h3>
              <CodeBlock code={installCode} language="bash" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Example</h3>
              <CodeBlock code={usageCode} language="javascript" />
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Tstai?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="🤖"
              title="AI-Powered"
              description="Write tests in natural language. Let AI handle the complexity."
            />
            <FeatureCard
              icon="⚡"
              title="Fast & Simple"
              description="No complex configuration. Get started in minutes, not hours."
            />
            <FeatureCard
              icon="🔒"
              title="Secure"
              description="Enterprise-grade security with built-in API key management."
            />
            <FeatureCard
              icon="📊"
              title="Analytics"
              description="Track API performance and monitor test results in real-time."
            />
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-base font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-base font-medium text-gray-900">{user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
