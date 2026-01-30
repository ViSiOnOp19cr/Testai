'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '../services/authService';
import Layout from '../components/Layout';

export default function DocsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('introduction');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = 'introduction';
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100 && sectionTop >= -section.clientHeight + 100) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative group">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => copyToClipboard(code, id)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
        >
          {copiedCode === id ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'installation', title: 'Installation' },
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'authentication', title: 'Authentication' },
    { id: 'writing-tests', title: 'Writing Tests' },
    { id: 'cli-reference', title: 'CLI Reference' },
    { id: 'configuration', title: 'Configuration' },
    { id: 'advanced', title: 'Advanced Features' },
    { id: 'examples', title: 'Examples' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
    { id: 'faq', title: 'FAQ' },
  ];

  if (!user) {
    return null;
  }

  return (
    <Layout>
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                On This Page
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#ff6b35] text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {/* Hero Section */}
            <div className="mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Tstai Documentation
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Write API tests in natural language and let AI handle the rest! ✨
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => scrollToSection('getting-started')}
                  className="px-6 py-3 bg-[#ff6b35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Introduction */}
            <section id="introduction" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">
                Tstai is a powerful AI-powered API testing framework that revolutionizes how you write and execute API tests. 
                Instead of learning complex testing frameworks or syntax, simply describe what you want to test in plain English, 
                and Tstai will handle the rest.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Key Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#ff6b35] mr-2"></span>
                  <span><strong>AI-Powered:</strong> Uses advanced AI to understand natural language test instructions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#ff6b35] mr-2"></span>
                  <span><strong>Simple Syntax:</strong> Write tests in plain English - no complex frameworks to learn</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#ff6b35] mr-2"></span>
                  <span><strong>Beautiful Output:</strong> Color-coded test results with detailed summaries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#ff6b35] mr-2"></span>
                  <span><strong>Detailed Logs:</strong> Optional JSON logs for all test runs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#ff6b35] mr-2"></span>
                  <span><strong>Secure Authentication:</strong> API key-based authentication system</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#ff6b35] mr-2"></span>
                  <span><strong>Fast & Reliable:</strong> Built with modern JavaScript and async/await</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">How It Works</h3>
              <p className="text-gray-700 mb-4">
                Tstai is a managed service with three main components:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">CLI Tool</h4>
                  <p className="text-sm text-gray-600">
                    Command-line interface for writing and running tests locally
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Managed Backend</h4>
                  <p className="text-sm text-gray-600">
                    Private cloud service that processes tests using AI
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Web Dashboard</h4>
                  <p className="text-sm text-gray-600">
                    Manage API keys, subscriptions, and view usage analytics
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Pricing</h3>
              <p className="text-gray-700 mb-4">
                Tstai offers flexible pricing to suit your testing needs:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="border-2 border-gray-300 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">Free Tier</h4>
                  <p className="text-3xl font-bold text-[#ff6b35] mb-2">$0<span className="text-base text-gray-600 font-normal">/month</span></p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>✓ Limited API calls per month</li>
                    <li>✓ All core features</li>
                    <li>✓ Community support</li>
                    <li>✓ Perfect for trying out Tstai</li>
                  </ul>
                </div>
                <div className="border-2 border-[#ff6b35] rounded-lg p-6 bg-orange-50">
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">Pro Plan</h4>
                  <p className="text-3xl font-bold text-[#ff6b35] mb-2">$10<span className="text-base text-gray-600 font-normal">/month</span></p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>✓ Unlimited API calls</li>
                    <li>✓ All core features</li>
                    <li>✓ Priority support</li>
                    <li>✓ Usage analytics</li>
                    <li>✓ Team collaboration (coming soon)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Installation</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prerequisites</h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Node.js version 18 or higher</li>
                <li>npm or pnpm package manager</li>
                <li>A Tstai account with API key (sign up on this platform)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Installation (Recommended)</h3>
              <p className="text-gray-700 mb-3">
                Install Tstai globally to use it from anywhere on your system:
              </p>
              <CodeBlock
                id="install-global"
                language="bash"
                code={`# Using npm
npm install -g tstai

# Using pnpm
pnpm add -g tstai`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Using npx (No Installation)</h3>
              <p className="text-gray-700 mb-3">
                You can also use Tstai without installation using npx:
              </p>
              <CodeBlock
                id="install-npx"
                language="bash"
                code={`npx tstai <command>`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Local Installation</h3>
              <p className="text-gray-700 mb-3">
                Install Tstai as a dev dependency in your project:
              </p>
              <CodeBlock
                id="install-local"
                language="bash"
                code={`# Using npm
npm install --save-dev tstai

# Using pnpm
pnpm add -D tstai`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Verify Installation</h3>
              <p className="text-gray-700 mb-3">
                Verify that Tstai is installed correctly:
              </p>
              <CodeBlock
                id="verify-install"
                language="bash"
                code={`tstai --version`}
              />
            </section>

            {/* Getting Started */}
            <section id="getting-started" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Sign Up & Get Your API Key</h3>
              <p className="text-gray-700 mb-4">
                First, create an account and get your Tstai API key:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
                <li>Register for a free account on this platform</li>
                <li>Navigate to the <Link href="/projects" className="text-[#ff6b35] hover:underline">Projects</Link> page</li>
                <li>Click "Generate API Key" button</li>
                <li>Copy your API key - you'll need it for authentication</li>
                <li>Start with the free tier (limited calls) or upgrade to Pro for unlimited access</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 2: Authenticate</h3>
              <p className="text-gray-700 mb-3">
                Login with your API key:
              </p>
              <CodeBlock
                id="quick-login"
                language="bash"
                code={`tstai login --api-key your-api-key-here`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 3: Create Your First Test</h3>
              <p className="text-gray-700 mb-3">
                Create a test file (e.g., <code className="bg-gray-100 px-2 py-1 rounded text-sm">tests/api.tests.js</code>):
              </p>
              <CodeBlock
                id="first-test"
                language="javascript"
                code={`import { tstai } from "tstai";

// Test a simple GET request
tstai("GET request to /users should return 200", {
  baseurl: "https://jsonplaceholder.typicode.com"
});

// Test a POST request
tstai("POST request to /posts with title and body should return 201", {
  baseurl: "https://jsonplaceholder.typicode.com"
});`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 4: Run Your Tests</h3>
              <p className="text-gray-700 mb-3">
                Execute your tests:
              </p>
              <CodeBlock
                id="run-tests"
                language="bash"
                code={`tstai run tests/api.tests.js`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Expected Output</h3>
              <CodeBlock
                id="output-example"
                language="text"
                code={`🚀 Running tests from: tests/api.tests.js

🧠 [1] GET request to /users should return 200
✅ Passed — GET /users (200)

🧠 [2] POST request to /posts with title and body should return 201
✅ Passed — POST /posts (201)

📊 Test Summary
==================================================
Total Tests: 2
✅ Passed: 2
❌ Failed: 0
Success Rate: 100.0%
==================================================`}
              />
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h2>
              <p className="text-gray-700 mb-6">
                Tstai uses API key authentication to secure your tests and track usage. There are two ways to authenticate:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Method 1: CLI Login (Recommended for Local)</h3>
              <p className="text-gray-700 mb-3">
                Store your API key locally in a config file:
              </p>
              <CodeBlock
                id="auth-cli"
                language="bash"
                code={`tstai login --api-key your-api-key-here`}
              />
              <p className="text-gray-700 mt-3 mb-6">
                This stores your key in <code className="bg-gray-100 px-2 py-1 rounded text-sm">~/.tstai/config.json</code>
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Method 2: Environment Variable (Recommended for CI/CD)</h3>
              <p className="text-gray-700 mb-3">
                Set the API key as an environment variable:
              </p>
              <CodeBlock
                id="auth-env"
                language="bash"
                code={`export TSTAI_API_KEY=your-api-key-here`}
              />
              <p className="text-gray-700 mt-3 mb-6">
                Environment variables take priority over CLI config.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Check Authentication Status</h3>
              <CodeBlock
                id="auth-status"
                language="bash"
                code={`tstai status`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Logout</h3>
              <p className="text-gray-700 mb-3">
                Clear stored credentials:
              </p>
              <CodeBlock
                id="auth-logout"
                language="bash"
                code={`tstai logout`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Managing API Keys</h3>
              <p className="text-gray-700 mb-3">
                You can manage your API keys through the web dashboard:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>View all your API keys in the <Link href="/projects" className="text-[#ff6b35] hover:underline">Projects</Link> page</li>
                <li>Generate new keys as needed</li>
                <li>Delete old or compromised keys</li>
                <li>Each key is tied to your user account</li>
              </ul>
            </section>

            {/* Writing Tests */}
            <section id="writing-tests" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Writing Tests</h2>
              <p className="text-gray-700 mb-6">
                Tstai's power lies in its natural language syntax. Simply describe what you want to test, 
                and the AI will understand and execute it.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Basic Test Structure</h3>
              <CodeBlock
                id="test-structure"
                language="javascript"
                code={`import { tstai } from "tstai";

tstai("your natural language instruction", {
  baseurl: "https://your-api.com"
});`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">HTTP Methods</h3>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">GET Requests</h4>
              <CodeBlock
                id="test-get"
                language="javascript"
                code={`// Simple GET
tstai("GET request to /posts should return 200", {
  baseurl: "https://api.example.com"
});

// GET specific resource
tstai("GET request to /users/1 should return 200", {
  baseurl: "https://api.example.com"
});

// GET with query parameters
tstai("GET request to /posts with userId=1 should return 200", {
  baseurl: "https://api.example.com"
});`}
              />

              <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-6">POST Requests</h4>
              <CodeBlock
                id="test-post"
                language="javascript"
                code={`// POST with data
tstai("POST request to /users with name and email should return 201", {
  baseurl: "https://api.example.com"
});

// POST login
tstai("POST request to /login with email and password should return 200", {
  baseurl: "https://api.example.com"
});`}
              />

              <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-6">PUT Requests</h4>
              <CodeBlock
                id="test-put"
                language="javascript"
                code={`// Update resource
tstai("PUT request to /users/1 with updated name should return 200", {
  baseurl: "https://api.example.com"
});`}
              />

              <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-6">DELETE Requests</h4>
              <CodeBlock
                id="test-delete"
                language="javascript"
                code={`// Delete resource
tstai("DELETE request to /users/1 should return 204", {
  baseurl: "https://api.example.com"
});`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Testing Different Status Codes</h3>
              <CodeBlock
                id="test-status-codes"
                language="javascript"
                code={`// Success responses
tstai("GET request to /posts should return 200", { baseurl: "https://api.example.com" });
tstai("POST request to /users should return 201", { baseurl: "https://api.example.com" });

// Client errors
tstai("GET request to /protected should return 401", { baseurl: "https://api.example.com" });
tstai("GET request to /not-found should return 404", { baseurl: "https://api.example.com" });

// Server errors
tstai("POST request to /broken should return 500", { baseurl: "https://api.example.com" });`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Best Practices</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Be specific about the endpoint path</li>
                <li>Include expected status codes in your description</li>
                <li>Mention request data fields when testing POST/PUT</li>
                <li>Use descriptive test names for better reports</li>
                <li>Group related tests in the same file</li>
                <li>Keep baseurl consistent within a test file</li>
              </ul>
            </section>

            {/* CLI Reference */}
            <section id="cli-reference" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">CLI Reference</h2>
              <p className="text-gray-700 mb-6">
                Complete reference for all Tstai CLI commands and options.
              </p>

              <div className="space-y-8">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">tstai login</h3>
                  <p className="text-gray-700 mb-3">Authenticate with your API key</p>
                  <CodeBlock
                    id="cli-login"
                    language="bash"
                    code={`tstai login --api-key <your-api-key>`}
                  />
                  <div className="mt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Options:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">--api-key</code> - Your Tstai API key (required)</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">tstai run</h3>
                  <p className="text-gray-700 mb-3">Execute tests from a file</p>
                  <CodeBlock
                    id="cli-run"
                    language="bash"
                    code={`tstai run [file] [options]`}
                  />
                  <div className="mt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Arguments:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">file</code> - Path to test file (default: tests/*.tests.js)</li>
                    </ul>
                    <h4 className="font-semibold text-gray-900 mb-2">Options:</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">--logs</code> - Generate JSON logs for all tests</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">--logs-failed</code> - Generate logs only for failed tests</li>
                    </ul>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                    <CodeBlock
                      id="cli-run-examples"
                      language="bash"
                      code={`# Run specific file
tstai run tests/api.tests.js

# Run with logs
tstai run tests/api.tests.js --logs

# Run with logs for failures only
tstai run tests/api.tests.js --logs-failed`}
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">tstai status</h3>
                  <p className="text-gray-700 mb-3">Check authentication status</p>
                  <CodeBlock
                    id="cli-status"
                    language="bash"
                    code={`tstai status`}
                  />
                  <p className="text-gray-700 mt-3">
                    Displays whether you're authenticated and which authentication method is being used.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">tstai logout</h3>
                  <p className="text-gray-700 mb-3">Clear stored credentials</p>
                  <CodeBlock
                    id="cli-logout"
                    language="bash"
                    code={`tstai logout`}
                  />
                  <p className="text-gray-700 mt-3">
                    Removes API key from local config file. Does not affect environment variables.
                  </p>
                </div>
              </div>
            </section>

            {/* Configuration */}
            <section id="configuration" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Configuration</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Environment Variables</h3>
              <p className="text-gray-700 mb-3">
                Configure Tstai CLI using environment variables:
              </p>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Variable</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Description</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Default</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4"><code className="bg-gray-100 px-2 py-1 rounded text-sm">TSTAI_API_KEY</code></td>
                      <td className="py-2 pr-4">Your API key</td>
                      <td className="py-2">-</td>
                    </tr>

                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Config File Location</h3>
              <p className="text-gray-700 mb-3">
                When you use <code className="bg-gray-100 px-2 py-1 rounded text-sm">tstai login</code>, 
                credentials are stored in:
              </p>
              <CodeBlock
                id="config-location"
                language="text"
                code={`~/.tstai/config.json`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Priority Order</h3>
              <p className="text-gray-700 mb-3">
                Tstai checks for API keys in this order:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>Environment variable (<code className="bg-gray-100 px-2 py-1 rounded text-sm">TSTAI_API_KEY</code>)</li>
                <li>Config file (<code className="bg-gray-100 px-2 py-1 rounded text-sm">~/.tstai/config.json</code>)</li>
              </ol>
            </section>

            {/* Advanced Features */}
            <section id="advanced" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Features</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Test Logs</h3>
              <p className="text-gray-700 mb-3">
                Generate detailed JSON logs of your test runs:
              </p>
              <CodeBlock
                id="advanced-logs"
                language="bash"
                code={`# All tests
tstai run tests/api.tests.js --logs

# Failed tests only
tstai run tests/api.tests.js --logs-failed`}
              />
              <p className="text-gray-700 mt-3 mb-6">
                Logs are saved to <code className="bg-gray-100 px-2 py-1 rounded text-sm">tests/testlogs/test-run-&lt;timestamp&gt;.json</code>
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">CI/CD Integration</h3>
              <p className="text-gray-700 mb-3">
                Integrate Tstai into your CI/CD pipeline:
              </p>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">GitHub Actions Example</h4>
              <CodeBlock
                id="advanced-github"
                language="yaml"
                code={`name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Tstai
        run: npm install -g tstai
      
      - name: Run Tests
        env:
          TSTAI_API_KEY: \${{ secrets.TSTAI_API_KEY }}
        run: tstai run tests/api.tests.js --logs`}
              />

              <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-6">GitLab CI Example</h4>
              <CodeBlock
                id="advanced-gitlab"
                language="yaml"
                code={`api-tests:
  image: node:18
  script:
    - npm install -g tstai
    - tstai run tests/api.tests.js --logs
  variables:
    TSTAI_API_KEY: $TSTAI_API_KEY`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Usage Monitoring</h3>
              <p className="text-gray-700 mb-3">
                Track your API usage and manage your subscription:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>View usage analytics in the <Link href="/projects" className="text-[#ff6b35] hover:underline">Projects</Link> dashboard</li>
                <li>Monitor remaining free tier calls</li>
                <li>Upgrade to Pro plan for unlimited access</li>
                <li>Download usage reports</li>
                <li>Set up usage alerts (coming soon)</li>
              </ul>
            </section>

            {/* Examples */}
            <section id="examples" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Examples</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">REST API Testing</h3>
              <CodeBlock
                id="example-rest"
                language="javascript"
                code={`import { tstai } from "tstai";

const baseurl = "https://jsonplaceholder.typicode.com";

// Get all posts
tstai("GET request to /posts should return 200", { baseurl });

// Get single post
tstai("GET request to /posts/1 should return 200", { baseurl });

// Create post
tstai("POST request to /posts with title and body should return 201", { baseurl });

// Update post
tstai("PUT request to /posts/1 with updated title should return 200", { baseurl });

// Delete post
tstai("DELETE request to /posts/1 should return 200", { baseurl });`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Authentication Testing</h3>
              <CodeBlock
                id="example-auth"
                language="javascript"
                code={`import { tstai } from "tstai";

const baseurl = "https://api.example.com";

// Login test
tstai("POST request to /api/auth/login with email and password should return 200", { 
  baseurl 
});

// Register test
tstai("POST request to /api/auth/register with name, email and password should return 201", { 
  baseurl 
});

// Protected route without auth
tstai("GET request to /api/protected should return 401", { 
  baseurl 
});`}
              />

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Error Handling Testing</h3>
              <CodeBlock
                id="example-errors"
                language="javascript"
                code={`import { tstai } from "tstai";

const baseurl = "https://api.example.com";

// Not found
tstai("GET request to /api/nonexistent should return 404", { baseurl });

// Unauthorized
tstai("GET request to /api/admin should return 401", { baseurl });

// Forbidden
tstai("DELETE request to /api/users/admin should return 403", { baseurl });

// Bad request
tstai("POST request to /api/users with invalid email should return 400", { baseurl });`}
              />
            </section>

            {/* Troubleshooting */}
            <section id="troubleshooting" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Troubleshooting</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff6b35] pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Failed</h3>
                  <p className="text-gray-700 mb-2"><strong>Problem:</strong> Getting "Authentication failed" error</p>
                  <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Check that your API key is correct</li>
                    <li>Verify authentication status: <code className="bg-gray-100 px-2 py-1 rounded text-sm">tstai status</code></li>
                    <li>Try logging in again: <code className="bg-gray-100 px-2 py-1 rounded text-sm">tstai login --api-key YOUR_KEY</code></li>
                    <li>Ensure your API key hasn't been deleted from the dashboard</li>
                  </ul>
                </div>

                <div className="border-l-4 border-[#ff6b35] pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Command Not Found</h3>
                  <p className="text-gray-700 mb-2"><strong>Problem:</strong> "tstai: command not found"</p>
                  <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Install globally: <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm install -g tstai</code></li>
                    <li>Or use npx: <code className="bg-gray-100 px-2 py-1 rounded text-sm">npx tstai</code></li>
                    <li>Check Node.js version (must be ≥18): <code className="bg-gray-100 px-2 py-1 rounded text-sm">node --version</code></li>
                  </ul>
                </div>

                <div className="border-l-4 border-[#ff6b35] pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tests Not Running</h3>
                  <p className="text-gray-700 mb-2"><strong>Problem:</strong> Tests file not being executed</p>
                  <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Verify file path is correct</li>
                    <li>Ensure test file uses ES modules (<code className="bg-gray-100 px-2 py-1 rounded text-sm">import</code> syntax)</li>
                    <li>Check that file has <code className="bg-gray-100 px-2 py-1 rounded text-sm">.js</code> extension</li>
                    <li>Verify you're authenticated: <code className="bg-gray-100 px-2 py-1 rounded text-sm">tstai status</code></li>
                  </ul>
                </div>

                <div className="border-l-4 border-[#ff6b35] pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Errors</h3>
                  <p className="text-gray-700 mb-2"><strong>Problem:</strong> Cannot connect to Tstai API</p>
                  <p className="text-gray-700 mb-2"><strong>Solution:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Check your internet connection</li>
                    <li>Verify the backend server is running</li>
                    <li>Check firewall settings</li>
                    <li>Ensure API URL is correct in configuration</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mb-16 scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">FAQ</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Is Tstai free to use?
                  </h3>
                  <p className="text-gray-700">
                    Tstai offers a free tier with limited API calls per month, perfect for trying out the service. 
                    For unlimited access, upgrade to the Pro plan at $10/month. We use AI models which incur costs, 
                    so the subscription helps maintain the service quality.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How does the AI understand my tests?
                  </h3>
                  <p className="text-gray-700">
                    Tstai uses OpenAI's GPT models to parse your natural language instructions and convert them into executable API requests.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I use Tstai with private APIs?
                  </h3>
                  <p className="text-gray-700">
                    Yes! Your test instructions and API endpoints are sent securely to our managed backend service, 
                    which executes them and returns results. We take security seriously - your data is encrypted in transit 
                    and we never store your API responses or sensitive data.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What happens to my API keys?
                  </h3>
                  <p className="text-gray-700">
                    API keys are securely stored in your local config file or environment variables. They're never exposed in logs or outputs. 
                    You can delete keys anytime from the dashboard.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I integrate Tstai with existing test frameworks?
                  </h3>
                  <p className="text-gray-700">
                    Yes! Tstai can complement existing frameworks like Jest, Mocha, or Cypress. Use Tstai for quick API endpoint validation and 
                    traditional frameworks for complex test scenarios.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How accurate is the AI interpretation?
                  </h3>
                  <p className="text-gray-700">
                    The AI is highly accurate for standard REST API patterns. For best results, be specific about HTTP methods, endpoints, 
                    and expected status codes in your test descriptions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What happens if I exceed my free tier limit?
                  </h3>
                  <p className="text-gray-700">
                    Once you reach your free tier limit, you'll need to upgrade to the Pro plan to continue testing. 
                    You can monitor your usage in the dashboard and upgrade anytime. Your existing tests and API keys 
                    will continue to work after upgrading.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I cancel my subscription?
                  </h3>
                  <p className="text-gray-700">
                    Yes, you can cancel your Pro subscription anytime from the dashboard. After cancellation, 
                    you'll still have access until the end of your billing period, then you'll be moved to the free tier.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 mt-16">
              <div className="text-center text-gray-600">
                <p className="mb-2">Need more help? Contact us at{' '}
                  <a href="mailto:chandancr515@gmail.com" className="text-[#ff6b35] hover:underline">
                    chandancr515@gmail.com
                  </a>
                </p>
                <p className="text-sm">
                  Made by Chandan C R
                </p>
              </div>
            </div>
          </main>
        </div>
    </Layout>
  );
}
