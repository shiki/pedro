/* eslint-disable global-require */

jest.mock('../services/db')
jest.mock('AsyncStorage', () => {
  const MockAsyncStorage = require('mock-async-storage').default
  return new MockAsyncStorage()
})
