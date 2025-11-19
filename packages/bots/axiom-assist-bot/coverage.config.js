module.exports = {
  // Coverage configuration for Jest
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '**/*.mjs',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!jest.config.js',
    '!babel.config.js',
    '!run-all-tests.mjs',
    '!test-*.mjs',
    '!install-*.mjs',
    '!**/adk-agents/**',
    '!**/mcp-server/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};