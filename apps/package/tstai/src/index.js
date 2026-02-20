// Use global state to share tests between instances
// This fixes the issue where global CLI and local package have different test arrays
if (!globalThis.__tstai_tests__) {
  globalThis.__tstai_tests__ = [];
}

export function tstai(instruction, options = {}) {
  globalThis.__tstai_tests__.push({ instruction, ...options });
}

export function getTests() {
  return globalThis.__tstai_tests__;
}

export function clearTests() {
  globalThis.__tstai_tests__ = [];
}
