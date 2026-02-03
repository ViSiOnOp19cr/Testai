import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'
import Layout from '../components/Layout'

/**
 * DocsPage Component - Comprehensive Documentation
 * 
 * This page provides complete documentation for the Tstai framework.
 * Features:
 * 1. Sticky sidebar navigation
 * 2. Multiple documentation sections
 * 3. Code blocks with copy functionality
 * 4. Smooth scroll navigation
 * 5. Active section highlighting
 * 
 * The content is organized into sections like Introduction, Installation,
 * Getting Started, Authentication, etc.
 */

export default function DocsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [activeSection, setActiveSection] = useState('introduction')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Check authentication
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      navigate('/login')
    } else {
      setUser(currentUser)
    }
  }, [navigate])

  /**
   * Track which section is currently visible
   * Updates active section based on scroll position
   */
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let currentSection = 'introduction'

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        // Check if section is in viewport
        if (sectionTop <= 100 && sectionTop >= -section.clientHeight + 100) {
          currentSection = section.id
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /**
   * Scroll to a specific section smoothly
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  /**
   * Copy code to clipboard with visual feedback
   */
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  /**
   * Reusable CodeBlock component for displaying code with copy button
   */
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
  )

  // Navigation sections for sidebar
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
  ]

  if (!user) {
    return null
  }

  return (
    <Layout>
      <div className="flex gap-8">
        {/* Sticky Sidebar Navigation */}
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

          {/* Introduction Section */}
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
                <span className="text-[#ff6b35] mr-2">✓</span>
                <span><strong>AI-Powered:</strong> Uses advanced AI to understand natural language test instructions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-2">✓</span>
                <span><strong>Simple Syntax:</strong> Write tests in plain English - no complex frameworks to learn</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-2">✓</span>
                <span><strong>Beautiful Output:</strong> Color-coded test results with detailed summaries</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-2">✓</span>
                <span><strong>Detailed Logs:</strong> Optional JSON logs for all test runs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-2">✓</span>
                <span><strong>Secure Authentication:</strong> API key-based authentication system</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#ff6b35] mr-2">✓</span>
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
          </section>

          {/* Installation Section */}
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
          </section>

          {/* Getting Started Section */}
          <section id="getting-started" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Step 1: Sign Up & Get Your API Key</h3>
            <p className="text-gray-700 mb-4">
              First, create an account and get your Tstai API key:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
              <li>Register for a free account on this platform</li>
              <li>Navigate to the <Link to="/projects" className="text-[#ff6b35] hover:underline">Projects</Link> page</li>
              <li>Click "Create API Key" button</li>
              <li>Copy your API key - you'll need it for authentication</li>
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
          </section>

          {/* Authentication Section */}
          <section id="authentication" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication</h2>
            <p className="text-gray-700 mb-6">
              Tstai uses API key authentication to secure your tests and track usage.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">CLI Login (Recommended for Local)</h3>
            <CodeBlock
              id="auth-cli"
              language="bash"
              code={`tstai login --api-key your-api-key-here`}
            />
            <p className="text-gray-700 mt-3 mb-6">
              This stores your key in <code className="bg-gray-100 px-2 py-1 rounded text-sm">~/.tstai/config.json</code>
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Environment Variable (Recommended for CI/CD)</h3>
            <CodeBlock
              id="auth-env"
              language="bash"
              code={`export TSTAI_API_KEY=your-api-key-here`}
            />
          </section>

          {/* Writing Tests Section */}
          <section id="writing-tests" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Writing Tests</h2>
            <p className="text-gray-700 mb-6">
              Tstai's power lies in its natural language syntax. Simply describe what you want to test!
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
});`}
            />
          </section>

          {/* CLI Reference Section */}
          <section id="cli-reference" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">CLI Reference</h2>

            <div className="space-y-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">tstai login</h3>
                <p className="text-gray-700 mb-3">Authenticate with your API key</p>
                <CodeBlock
                  id="cli-login"
                  language="bash"
                  code={`tstai login --api-key <your-api-key>`}
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">tstai run</h3>
                <p className="text-gray-700 mb-3">Execute tests from a file</p>
                <CodeBlock
                  id="cli-run"
                  language="bash"
                  code={`tstai run [file] [options]

# Examples:
tstai run tests/api.tests.js
tstai run tests/api.tests.js --logs`}
                />
              </div>
            </div>
          </section>

          {/* Configuration Section */}
          <section id="configuration" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Configuration</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Environment Variables</h3>
            <div className="border border-gray-200 rounded-lg p-4 mb-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-900">Variable</th>
                    <th className="text-left py-2 font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4"><code className="bg-gray-100 px-2 py-1 rounded text-sm">TSTAI_API_KEY</code></td>
                    <td className="py-2">Your API key</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Advanced Features Section */}
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

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">CI/CD Integration</h3>
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
          </section>

          {/* Examples Section */}
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

// Create post
tstai("POST request to /posts with title and body should return 201", { baseurl });

// Update post
tstai("PUT request to /posts/1 with updated title should return 200", { baseurl });`}
            />
          </section>

          {/* Troubleshooting Section */}
          <section id="troubleshooting" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Troubleshooting</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Issues</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-[#ff6b35] pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">Authentication errors</h4>
                <p className="text-gray-700 text-sm">
                  Make sure your API key is correctly set. Use <code className="bg-gray-100 px-2 py-1 rounded text-sm">tstai status</code> to check.
                </p>
              </div>
              <div className="border-l-4 border-[#ff6b35] pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">Request timeout</h4>
                <p className="text-gray-700 text-sm">
                  Check your internet connection and verify the API endpoint is accessible.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="mb-16 scroll-mt-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">FAQ</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Is Tstai free to use?
                </h3>
                <p className="text-gray-700">
                  A: Tstai offers a free tier with limited API calls. For unlimited access, upgrade to the Pro plan for ₹199/month.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Can I use Tstai in CI/CD pipelines?
                </h3>
                <p className="text-gray-700">
                  A: Yes! Tstai works great in CI/CD. Just set the TSTAI_API_KEY environment variable in your pipeline.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Q: Where can I get support?
                </h3>
                <p className="text-gray-700">
                  A: Check the documentation first. For additional help, contact support through chandancr515@gmail.com .
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  )
}
