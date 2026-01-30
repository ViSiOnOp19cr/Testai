'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '../services/authService';
import Layout from '../components/Layout';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return null;
  }

  const codeExample = `import { tstai } from 'tstai';

tstai('GET request to /users should return 200', {
  baseurl: 'https://api.example.com'
});`;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              API testing via natural language{' '}
              <span className="text-[#ff6b35]">AI tests</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Write tests in plain English and let AI handle the execution. Built with simplicity and seamless integration.
            </p>
          </div>
        </div>

        {/* Code Example Section */}
        <div className="px-4 py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Write tests in plain English
            </h2>
            <div className="relative">
              <div className="absolute right-3 top-3 z-10">
                <button
                  onClick={() => copyToClipboard(codeExample)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
                <code className="text-sm font-mono">{codeExample}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-4 py-16 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Ready to get started?
              </h2>
              <p className="text-gray-600 max-w-md">
                Start writing natural language tests today and let AI handle the implementation. 
                Focus on describing your test scenarios while Tstai takes care of the rest.
              </p>
            </div>
            <Link
              href="/docs"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            >
              View Documentation
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
