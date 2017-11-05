// src/services/__mocks__/db.js

import check from 'offensive'

import { User, Stock } from '../../models'

/**
 * @type {Object.<string, User>}
 */
let users = {}
/**
 * @type {Object.<string.Stock>}
 */
let stocks = {}

export const database = {
  deleteAll: jest.fn(
    () =>
      new Promise(resolve => {
        users = {}
        stocks = {}
        resolve()
      })
  ),

  saveUser: jest.fn(
    user =>
      new Promise(resolve => {
        check(user, 'user').is.anInstanceOf(User)
        users[user.uuid] = user
        resolve()
      })
  ),

  findUser: jest.fn(
    ({ uuid }) =>
      new Promise(resolve => {
        resolve(users[uuid] || null)
      })
  ),

  findUsers: jest.fn(
    () =>
      new Promise(resolve => {
        resolve(Object.values(users))
      })
  ),

  saveStock: jest.fn(
    stock =>
      new Promise(resolve => {
        check(stock, 'stock').is.anInstanceOf(Stock)
        stocks[stock.symbol] = stock
        resolve()
      })
  ),

  findStocks: jest.fn(
    () =>
      new Promise(resolve => {
        resolve(Object.values(stocks))
      })
  ),

  findStock: jest.fn(
    ({ symbol }) =>
      new Promise(resolve => {
        resolve(stocks[symbol] || null)
      })
  ),

  findLastUpdatedStock: jest.fn(
    () =>
      new Promise(resolve => {
        const sorted = Object.values(stocks).sort((left, right) => (left.updated_at.isBefore(right.updated_at) ? -1 : 1))
        resolve(sorted.length > 0 ? sorted[sorted.length - 1] : null)
      })
  )
}

export default { database }
