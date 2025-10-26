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
  .action(async (file) => {
    const filePath = path.resolve(process.cwd(), file || "tests/example.tests.js");
    await runTestsFromFile(filePath);
  });

program.parse(process.argv);
