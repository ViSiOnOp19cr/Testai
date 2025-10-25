import { getTests } from "./index.js";
import { parseInstruction } from "./parser.js";
import axios from "axios";
import { logResult } from "./logger.ts";

export async function runTestsFromFile(filePath) {
  console.log(`\n🚀 Running tests from: ${filePath}\n`);
  await import(filePath); // load user's test file
  const tests = getTests();

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
  }
}
