import { getTests } from "./index.js";
import { parseInstruction } from "./parser.js";
import axios from "axios";
import { logResult, ensureTestLogsDirectory, generateLogFileName, writeTestLogs } from "./logger.js";

export async function runTestsFromFile(filePath, options={}) {
  console.log(`\n🚀 Running tests from: ${filePath}\n`);
  
  await import(filePath); // load user's test file
  const tests = getTests();

  let passedCount = 0;
  let failedCount = 0;
  const results = [];

  const apiKey = options.apiKey || null;
  
  for (const [i, t] of tests.entries()) {
    console.log(`🧠 [${i + 1}] ${t.instruction}`);
    const plan = await parseInstruction(t.instruction, apiKey);

    const url = `${t.baseurl}${plan.endpoint}`;

    const startTime = performance.now();

    const axiosConfig = {
      method: plan.method,
      url,
      data: plan.payload,
      validateStatus: () => true
    };
    const res = await axios(axiosConfig);

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    const requestHeaders = res.config.headers;

    const passed = res.status === plan.expected_status;
    logResult(plan, res, passed);
    
    // Count passed/failed tests
    if (passed) {
      passedCount++;
    } else {
      failedCount++;
    }
    
    const testData = {
      testNumber: i+1,
      instruction: t.instruction,
      request:{
        method : plan.method,
        url:url,
        headers:requestHeaders,
        payload:plan.payload,
        baseurl:t.baseurl,
        endpoint:plan.endpoint
      },
      response:{
        status:res.status,
        statusText:res.statusText,
        headers:res.headers,
        data:res.data,
        responseTime:responseTime
      },
      result: passed ? "PASSED" : "FAILED",
      expectedStatus:plan.expected_status,
      actualStatus:res.status
    }
    
    results.push(testData);
  }

  // Display test summary
  console.log("📊 Test Summary");
  console.log("=".repeat(50));
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`Success Rate: ${((passedCount / tests.length) * 100).toFixed(1)}%`);
  
  if (failedCount > 0) {
    console.log("\n🔍 Failed Tests:");
    results.filter(r => r.result === "FAILED").forEach((result, index) => {
      console.log(`${index + 1}. ${result.instruction}`);
      console.log(`   Expected: ${result.expectedStatus}, Got: ${result.actualStatus}`);
    });
  }
  
  console.log("=".repeat(50));
  
  // Write logs if requested
  if(options.logs || options.logsFailed){
    try {
      const testLogsDir = ensureTestLogsDirectory();
      
      // Filter results if only failed logs are requested
      let filteredResults = results;
      if(options.logsFailed && !options.logs){
        filteredResults = results.filter(r => r.result === "FAILED");
      }
      
      const logData = {
        testRunId: generateLogFileName().replace('.json', ''),
        timestamp: new Date().toISOString(),
        totalTests: tests.length,
        passed: passedCount,
        failed: failedCount,
        tests: filteredResults
      };
      writeTestLogs(testLogsDir, logData, options);
    } catch (error) {
      console.error('❌ Failed to write test logs:', error.message);
    }
  }
}
