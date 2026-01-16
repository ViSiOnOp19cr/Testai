# TSTAI - AI-Powered API Testing CLI

[![npm version](https://img.shields.io/npm/v/tstai.svg)](https://www.npmjs.com/package/tstai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Write API tests in natural language and let AI handle the rest! ✨

TSTAI is a powerful CLI tool that allows you to write API tests in plain English. No need to learn complex testing frameworks or syntax - just describe what you want to test, and TSTAI will handle the rest using AI.

## 🌟 Features

- 🤖 **AI-Powered**: Uses advanced AI to understand natural language test instructions
- 🚀 **Simple Syntax**: Write tests in plain English
- 📊 **Beautiful Output**: Color-coded test results with detailed summaries
- 📝 **Detailed Logs**: Optional JSON logs for all tests
- 🔐 **Secure Authentication**: API key-based authentication
- ⚡ **Fast & Reliable**: Built with modern JavaScript and async/await

## 📦 Installation

```bash
# Install globally
npm install -g tstai

# Or use with npx (no installation required)
npx tstai <command>
```

## 🚀 Quick Start

### 1. Login with API Key

First, you need to authenticate with your TSTAI API key:

```bash
tstai login --api-key your-api-key-here
```

Don't have an API key? Sign up at [your-website.com](https://your-website.com) to get one!

### 2. Create a Test File

Create a file `tests/api.tests.js`:

```javascript
import { tstai } from "tstai";

// Simple GET request test
tstai("GET request to /users should return 200", {
  baseurl: "https://api.example.com"
});

// POST request test
tstai("POST request to /login with email and password should return 200", {
  baseurl: "https://api.example.com"
});

// Test with specific endpoint
tstai("GET request to /users/1 should return 200", {
  baseurl: "https://api.example.com"
});
```

### 3. Run Your Tests

```bash
tstai run tests/api.tests.js
```

### 4. View Results

You'll see beautiful colored output:

```
🚀 Running tests from: tests/api.tests.js

🧠 [1] GET request to /users should return 200
✅ Passed — GET /users (200)

🧠 [2] POST request to /login with email and password should return 200
✅ Passed — POST /login (200)

📊 Test Summary
==================================================
Total Tests: 2
✅ Passed: 2
❌ Failed: 0
Success Rate: 100.0%
==================================================
```

## 📖 Usage

### Commands

#### `tstai login`
Authenticate with your API key

```bash
# Login interactively
tstai login --api-key your-api-key

# Or use environment variable
export TSTAI_API_KEY=your-api-key
```

#### `tstai run [file]`
Run tests from a file

```bash
# Run specific test file
tstai run tests/api.tests.js

# Run with logs
tstai run tests/api.tests.js --logs

# Run with logs only for failed tests
tstai run tests/api.tests.js --logs-failed
```

#### `tstai status`
Check authentication status

```bash
tstai status
```

#### `tstai logout`
Clear stored credentials

```bash
tstai logout
```

## 📝 Writing Tests

### Basic Test Structure

```javascript
import { tstai } from "tstai";

tstai("your natural language instruction", {
  baseurl: "https://your-api.com"
});
```

### Examples

```javascript
// Simple GET
tstai("GET request to /posts should return 200", {
  baseurl: "https://jsonplaceholder.typicode.com"
});

// POST with data
tstai("POST request to /users with name and email should return 201", {
  baseurl: "https://api.example.com"
});

// PUT request
tstai("PUT request to /users/1 with updated name should return 200", {
  baseurl: "https://api.example.com"
});

// DELETE request
tstai("DELETE request to /users/1 should return 204", {
  baseurl: "https://api.example.com"
});

// Different status codes
tstai("GET request to /protected should return 401", {
  baseurl: "https://api.example.com"
});
```

## 🔐 Authentication

TSTAI supports two authentication methods:

### 1. CLI Config (Recommended for local development)
```bash
tstai login --api-key your-key
```
Stores the key in `~/.tstai/config.json`

### 2. Environment Variable (Recommended for CI/CD)
```bash
export TSTAI_API_KEY=your-key
```
Environment variables take priority over CLI config.

## 📊 Test Logs

Generate detailed JSON logs for your test runs:

```bash
# Generate logs for all tests
tstai run tests/api.tests.js --logs

# Generate logs only for failed tests
tstai run tests/api.tests.js --logs-failed
```

Logs are saved to `tests/testlogs/test-run-<timestamp>.json`

## 🛠️ Configuration

### API Configuration

By default, TSTAI uses the hosted API at `http://localhost:3006`. You can configure this in the source code if you're self-hosting.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Chandan C R**

## 🙏 Acknowledgments

- Built with Node.js
- Powered by OpenAI
- Inspired by the need for simpler API testing

## 🐛 Issues

Found a bug? Please [open an issue](https://github.com/yourusername/Zest/issues)

## 📮 Support

Need help? Reach out at [your-email@example.com]

---

**Happy Testing! 🚀**
