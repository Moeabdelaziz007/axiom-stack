// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts', '**/test/integration/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};