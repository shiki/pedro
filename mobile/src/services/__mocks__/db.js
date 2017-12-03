// src/services/__mocks__/db.js

import check from 'offensive'

import { User, Stock, Alert } from '../../models'

/**
 * @type {Object.<string, User>}
 */
let users = {}
/**
 * @type {Object.<string, Stock>}
 */
let stocks = {}

/**
 * @type {Object.<string, Alert>}
 */
let alerts = {}

export const database = {
  deleteAll: jest.fn(
    () =>
      new Promise(resolve => {
        users = {}
        stocks = {}
        alerts = {}
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
    uuid =>
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
        check(stock.symbol, 'stock.symbol').is.aString()
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
    symbol =>
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
  ),

  saveAlert: jest.fn(
    alert =>
      new Promise(resolve => {
        check(alert, 'alert').is.anInstanceOf(Alert)
        check(alert.uuid, 'alert.uuid').is.aString()
        alerts[alert.uuid] = alert
        resolve()
      })
  ),

  findAlert: jest.fn(
    uuid =>
      new Promise(resolve => {
        check(uuid, 'uuid').is.aString()
        resolve(alerts[uuid] || null)
      })
  ),

  findAlerts: jest.fn(
    userUUID =>
      new Promise(resolve => {
        check(userUUID, 'userUUID').is.aString()
        const foundAlerts = Object.values(alerts).filter(a => a.user_uuid === userUUID)
        resolve(foundAlerts)
      })
  )
}

export default { database }
