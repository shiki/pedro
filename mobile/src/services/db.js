import SQLite from 'react-native-sqlite-storage'
import check from 'offensive'

import { database as databaseConfig } from '../config'

import { User, Stock, Alert } from '../models'

const SQLITE_ISO_8601_FORMAT = '%Y-%m-%dT%H:%M:%fZ'

SQLite.DEBUG(databaseConfig.DEBUG)
SQLite.enablePromise(true)

let sqliteDB = null

export async function open() {
  sqliteDB = await SQLite.openDatabase({ name: 'pedro.sqlite', location: 'default' })
  await sqliteDB.executeSql('PRAGMA foreign_keys = ON;')

  await migrate(sqliteDB)
  return { database }
}

async function migrate(db) {
  await db.transaction(trans => {
    trans.executeSql(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        executed_at TEXT DEFAULT(STRFTIME('${SQLITE_ISO_8601_FORMAT}', 'NOW')) NOT NULL
      );
    `)

    trans.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        uuid TEXT PRIMARY KEY,
        password TEXT,
        apns_key TEXT,
        created_at TEXT DEFAULT(STRFTIME('${SQLITE_ISO_8601_FORMAT}', 'NOW')) NOT NULL,
        updated_at TEXT DEFAULT(STRFTIME('${SQLITE_ISO_8601_FORMAT}', 'NOW')) NOT NULL,
        synchronized INTEGER DEFAULT(0) NOT NULL
      );
    `)

    trans.executeSql(`
      CREATE TABLE IF NOT EXISTS stocks (
        symbol TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        as_of TEXT NOT NULL,
        price TEXT NOT NULL,
        percent_change TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `)

    trans.executeSql(`
      CREATE TABLE IF NOT EXISTS alerts (
        uuid TEXT PRIMARY KEY,
        user_uuid TEXT NOT NULL,
        stock_symbol TEXT NOT NULL,
        operator TEXT NOT NULL,
        price TEXT NOT NULL,
        notes TEXT,
        triggered INTEGER DEFAULT(0) NOT NULL,
        created_at TEXT DEFAULT(STRFTIME('${SQLITE_ISO_8601_FORMAT}', 'NOW')) NOT NULL,
        updated_at TEXT DEFAULT(STRFTIME('${SQLITE_ISO_8601_FORMAT}', 'NOW')) NOT NULL,
        synchronized INTEGER DEFAULT(0) NOT NULL,

        FOREIGN KEY(user_uuid) REFERENCES users(uuid),
        FOREIGN KEY(stock_symbol) REFERENCES stocks(symbol)
      );
    `)
  })
}

/**
 * @param {int} count
 * @return {string}
 */
function createQueryPlaceholders(count) {
  return Array(count)
    .fill('?')
    .join(',')
}

/**
 * @param {Object} param
 * @param {string} param.query
 * @param {?Object[]} param.params
 */
async function executeSql({ query, params = null, useWriteTransaction = false }) {
  const catchHandler = dbError => {
    const message = `${dbError.message}. Tried to execute query '${query}' with params ${JSON.stringify(params)}`
    const error = new Error(message)
    // TODO replace console.error with third party error logging
    console.error(error)
    return Promise.reject(error)
  }

  if (useWriteTransaction) {
    let result = null
    return sqliteDB
      .transaction(async trans => {
        result = await trans.executeSql(query, params)
      })
      .then(() => result)
      .catch(catchHandler)
  }

  let result = null
  return sqliteDB
    .readTransaction(async trans => {
      result = await trans.executeSql(query, params)
    })
    .then(() => result)
    .catch(catchHandler)
}

/**
 * @param {string} query
 * @param {?Object[]} params
 */
async function findOne(query, params = null) {
  return find(query, params).then(rows => (rows.length > 0 ? rows[0] : null))
}

/**
 * @param {string} query
 * @param {?Object[]} params
 * @returns {Object[]}
 */
async function find(query, params = null) {
  return executeSql({ query, params }).then(result => result[1].rows.raw())
}

/**
 * @param {string} table
 * @param {Object} row
 */
async function insertOrReplace(table, row) {
  const keys = Object.keys(row)
  const query = `INSERT OR REPLACE INTO ${table} (${keys.join(',')}) VALUES (${createQueryPlaceholders(keys.length)})`
  const params = keys.map(key => row[key])
  return executeSql({ query, params, useWriteTransaction: true }).then(result => {
    const rowsAffected = result[1].rowsAffected
    check(rowsAffected, 'rowsAffected').to.be.greaterThan(0)
    return { rowsAffected }
  })
}

export const database = {
  async deleteAll() {
    return sqliteDB.transaction(trans => {
      trans.executeSql('DELETE FROM alerts')
      trans.executeSql('DELETE FROM stocks')
      trans.executeSql('DELETE FROM users')
    })
  },

  /**
   * @param {User} user
   */
  async saveUser(user) {
    check(user, 'user').is.anInstanceOf(User)
    return insertOrReplace('users', User.toDB(user))
  },

  /**
   * @param {string} uuid
   * @return {User|null}
   */
  async findUser(uuid) {
    check(uuid, 'uuid').is.aString()
    return findOne('SELECT * FROM users WHERE uuid=?', [uuid]).then(row => (row != null ? User.fromDB(row) : null))
  },

  /**
   * @param {Stock} stock
   */
  async saveStock(stock) {
    check(stock, 'stock').is.anInstanceOf(Stock)
    return insertOrReplace('stocks', Stock.toDB(stock))
  },

  /**
   * @return {Stock[]}
   */
  async findStocks() {
    return find('SELECT * FROM stocks').then(rows => rows.map(Stock.fromDB))
  },

  /**
   * @param {string} symbol
   * @return {Stock|null}
   */
  async findStock(symbol) {
    check(symbol, 'symbol').is.aString()
    return findOne('SELECT * FROM stocks WHERE symbol=?', [symbol]).then(row => (row != null ? Stock.fromDB(row) : null))
  },

  /**
   * @return {Stock|null}
   */
  async findLastUpdatedStock() {
    return findOne('SELECT * FROM stocks ORDER BY updated_at DESC LIMIT 1').then(row => (row != null ? Stock.fromDB(row) : null))
  },

  /**
   * @param {Alert} alert
   */
  saveAlert(alert) {
    check(alert, 'alert').is.anInstanceOf(Alert)
    return insertOrReplace('alerts', Alert.toDB(alert))
  },

  /**
   * @param {string} uuid
   * @return {Promise<Alert|null,Error>}
   */
  async findAlert(uuid) {
    check(uuid, 'uuid').is.aString()
    return findOne('SELECT * FROM alerts WHERE uuid=?', [uuid]).then(row => (row != null ? Alert.fromDB(row) : null))
  },

  /**
   * @param {string} userUUID
   * @return {Alert[]}
   */
  async findAlerts(userUUID) {
    check(userUUID, 'userUUID').is.aString()
    return find('SELECT * FROM alerts WHERE user_uuid=?', [userUUID]).then(rows => rows.map(Alert.fromDB))
  }
}
