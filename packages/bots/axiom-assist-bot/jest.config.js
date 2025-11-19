export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js', '**/*.test.mjs'],
  collectCoverageFrom: [
    'api/**/*.mjs',
    'orchestrator.mjs',
    'model-armor-service.mjs',
    '!**/node_modules/**'
  ],
  coverageDirectory: '<rootDir>/coverage',
  verbose: true,
  transform: {
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'mjs', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};