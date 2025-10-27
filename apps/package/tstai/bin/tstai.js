import { program } from "commander";
import path from "path";
import { runTestsFromFile } from "../src/runner.js";

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
    await runTestsFromFile(filePath,options);
  });


program.parse(process.argv);
