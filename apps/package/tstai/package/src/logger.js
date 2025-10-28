import chalk from "chalk";
import fs from "fs";
import path from "path";

export function ensureTestLogsDirectory(){
  const testLogsDir = path.join(process.cwd(),"tests","testlogs");
  if(!fs.existsSync(testLogsDir)){
    fs.mkdirSync(testLogsDir,{recursive:true});
  }
  return testLogsDir;
}

export function generateLogFileName() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `test-run-${timestamp}.json`;
}

export function writeTestLogs(testLogsDir, logData, options) {
  const filename = generateLogFileName();
  const filePath = path.join(testLogsDir, filename);
  
  // Write the log data
  fs.writeFileSync(filePath, JSON.stringify(logData, null, 2));
  console.log(`📝 Test logs written to: ${filePath}`);
}

export function logResult(plan, res, passed) {
  if (passed) {
    console.log(chalk.green(`✅ Passed — ${plan.method} ${plan.endpoint} (${res.status})`));
  } else {
    console.log(chalk.red(`❌ Failed — Expected ${plan.expected_status}, got ${res.status}`));
  }
  console.log("");
}
