import { getTests } from "./index.js";
import { parseInstruction } from "./parser.js";
import axios from "axios";
import { logResult } from "./logger.ts";

export async function runTestsFromFile(filePath) {
  console.log(`\n🚀 Running tests from: ${filePath}\n`);
  await import(filePath); // load user's test file
  const tests = getTests();

  let passedCount = 0;
  let failedCount = 0;
  const results = [];

  for (const [i, t] of tests.entries()) {
    console.log(`🧠 [${i + 1}] ${t.instruction}`);
    const plan = await parseInstruction(t.instruction);

    const url = `${t.baseurl}${plan.endpoint}`;
    const res = await axios({
      method: plan.method,
      url,
      data: plan.payload,
      validateStatus: () => true
    });

    const passed = res.status === plan.expected_status;
    logResult(plan, res, passed);
    
    results.push({ test: t.instruction, passed, status: res.status, expected: plan.expected_status });
    if (passed) {
      passedCount++;
    } else {
      failedCount++;
    }
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
    results.filter(r => !r.passed).forEach((result, index) => {
      console.log(`${index + 1}. ${result.test}`);
      console.log(`   Expected: ${result.expected}, Got: ${result.status}`);
    });
  }
  
  console.log("=".repeat(50));
}
