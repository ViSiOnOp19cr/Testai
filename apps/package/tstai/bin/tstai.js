#!/usr/bin/env node

import { program } from "commander";
import path from "path";
import { runTestsFromFile } from "../src/runner.js";
import { logout, whoami, isAuthenticated, setApiKey, getAuthStatus } from "../src/auth.js";

program
  .name("tstai")
  .description("Run AI-powered API tests written in natural language")
  .version("1.0.0");

program
  .command("run [file]")
  .description("Run test file")
  .option("--logs", "Generate logs for all tests")
  .option("--logs-failed", "Generate logs for failed tests only")
  .action(async (file, options) => {
    const filePath = path.resolve(process.cwd(), file || "tests/example.tests.js");
    await runTestsFromFile(filePath, options);
  });

program
  .command("login")
  .description("Authenticate with TSTAI API")
  .option("--api-key <key>", "Set API key directly")
  .action(async (options) => {
    try {
      if (options.apiKey) {
        // Check if environment variable is set
        if (process.env.TSTAI_API_KEY) {
          console.log("⚠️  Environment variable TSTAI_API_KEY is already set.");
          console.log("   Environment variables take priority over CLI config.");
          console.log("   To use CLI config, unset the environment variable first:");
          console.log("   unset TSTAI_API_KEY");
          console.log("\n   Or use the environment variable directly:");
          console.log("   export TSTAI_API_KEY=your-key");
          process.exit(1);
        }

        setApiKey(options.apiKey);
        console.log("✅ API key saved to config file!");
        console.log("💡 This method is ideal for local development.");
        const userInfo = await whoami();
        console.log(`👤 Logged in as: ${userInfo.email || 'Unknown'}`);
      } else {
        console.log("Please provide --api-key option.");
        console.log("\nAuthentication methods:");
        console.log("1. Environment variable: export TSTAI_API_KEY=your-key");
        console.log("2. CLI login: tstai login --api-key your-key");
        console.log("\nExample: tstai login --api-key your-api-key-here");
        process.exit(1);
      }
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      process.exit(1);
    }
  });

program
  .command("logout")
  .description("Logout and clear stored credentials")
  .action(() => {
    const authStatus = getAuthStatus();

    if (!authStatus.authenticated) {
      console.log("❌ Not authenticated. Nothing to logout.");
      return;
    }

    if (authStatus.method === 'environment') {
      console.log("⚠️  Using environment variable (TSTAI_API_KEY)");
      console.log("   To logout, unset the environment variable:");
      console.log("   unset TSTAI_API_KEY");
      console.log("\n   Or restart your terminal session.");
    } else {
      logout();
      console.log("✅ Logged out successfully!");
      console.log("💡 Cleared stored config file.");
    }
  });

program
  .command("status")
  .description("Check authentication status")
  .action(async () => {
    try {
      const authStatus = getAuthStatus();

      if (!authStatus.authenticated) {
        console.log("❌ Not authenticated.");
        console.log("\nAuthentication methods:");
        console.log("1. Environment variable: export TSTAI_API_KEY=your-key");
        console.log("2. CLI login: tstai login --api-key your-key");
        process.exit(1);
      }

      const userInfo = await whoami();
      console.log("✅ Authenticated successfully!");
      console.log(`🔑 Method: ${authStatus.method === 'environment' ? 'Environment Variable' : 'CLI Config'}`);
      console.log(`👤 User: ${userInfo.email || 'Unknown'}`);
      console.log(`🆔 ID: ${userInfo.id || 'Unknown'}`);

      if (authStatus.method === 'environment') {
        console.log("\n💡 Using environment variable (TSTAI_API_KEY)");
        console.log("   This is ideal for CI/CD and automated environments.");
      } else {
        console.log("\n💡 Using stored config file (~/.tstai/config.json)");
        console.log("   This is ideal for local development.");
      }
    } catch (error) {
      console.error("❌ Authentication check failed:", error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
