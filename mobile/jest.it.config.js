// Jest Integration Tests configuration
module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/integrationTests/lib/init.js',
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/src', '<rootDir>/integrationTests/specs']
}
