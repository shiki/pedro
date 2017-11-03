// Jest Unit Test Configuration
module.exports = {
  preset: 'react-native',
  setupTestFrameworkScriptFile: '<rootDir>/src/__tests__/init.js',
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/src/__tests__/init.js', '<rootDir>/integrationTests']
}
