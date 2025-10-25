import chalk from "chalk";

export function logResult(plan, res, passed) {
  if (passed) {
    console.log(chalk.green(`✅ Passed — ${plan.method} ${plan.endpoint} (${res.status})`));
  } else {
    console.log(chalk.red(`❌ Failed — Expected ${plan.expected_status}, got ${res.status}`));
  }
  console.log("");
}
