const tests = [];

export function name_app(instruction, options = {}) {
  tests.push({ instruction, ...options });
}

export function getTests() {
  return tests;
}
