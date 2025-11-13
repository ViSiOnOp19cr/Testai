const tests = [];

export function tstai(instruction, options = {}) {
  tests.push({ instruction, ...options });
}

export function getTests() {
  return tests;
}
