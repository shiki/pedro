/* global fetch:true */
/* exported fetch */
/* eslint-disable global-require */

// The react-native built-in fetch uses whatwg-fetch but is not available when running just in Node. We will use node-fetch instead.
fetch = require('node-fetch').default

jest.mock('../services/db')
jest.mock('AsyncStorage', () => {
  const MockAsyncStorage = require('mock-async-storage').default
  return new MockAsyncStorage()
})
