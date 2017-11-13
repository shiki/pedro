import SQLite from 'react-native-sqlite-storage'

import { database as databaseConfig } from '../config'

import { User, Stock, Alert } from '../models'

const SQLITE_ISO_8601_FORMAT = '%Y-%m-%dT%H:%M:%fZ'

SQLite.DEBUG(databaseConfig.DEBUG)
SQLite.enablePromise(true)

let sqliteDB = null

export async function open() {
  sqliteDB = await SQLite.openDatabase({ name: 'pedro.sqlite', location: 'default' })
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

export const database = {
  async deleteAll() {
    await sqliteDB.transaction(async trans => {
      trans.executeSql('DELETE FROM stocks')
      trans.executeSql('DELETE FROM users')
    })
  },

  /**
   * @param {Object} params
   * @param {string} params.uuid
   * @return {User|null}
   */
  async findUser({ uuid }) {
    let user = null
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM users WHERE uuid=?', [uuid])
      const rows = result[1].rows
      user = rows.length > 0 ? User.fromDB(rows.item(0)) : null
    })
    return user
  },

  /**
   * @param {User} user
   */
  async saveUser(user) {
    await sqliteDB.transaction(async trans => {
      const forDB = User.toDB(user)
      const keys = Object.keys(forDB)
      const query = `INSERT OR REPLACE INTO users (${keys.join(',')}) VALUES (${createQueryPlaceholders(keys.length)})`
      const params = keys.map(key => forDB[key])
      await trans.executeSql(query, params)
    })
  },

  /**
   * @return {Stock[]}
   */
  async findStocks() {
    let stocks = []
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM stocks')
      const rows = result[1].rows
      stocks = rows.raw().map(Stock.fromDB)
    })
    return stocks
  },

  /**
   * @return {Stock|null}
   */
  async findStock({ symbol }) {
    let stock = null
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM stocks WHERE symbol=?', [symbol])
      const rows = result[1].rows
      stock = rows.length > 0 ? Stock.fromDB(rows.item(0)) : null
    })
    return stock
  },

  /**
   * @return {Stock|null}
   */
  async findLastUpdatedStock() {
    let stock = null
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM stocks ORDER BY updated_at DESC LIMIT 1')
      const rows = result[1].rows
      stock = rows.length > 0 ? Stock.fromDB(rows.item(0)) : null
    })
    return stock
  },

  /**
   * @param {Stock} stock
   */
  async saveStock(stock) {
    await sqliteDB.transaction(async trans => {
      const forDB = Stock.toDB(stock)
      const keys = Object.keys(forDB)
      const query = `INSERT OR REPLACE INTO stocks (${keys.join(',')}) VALUES (${createQueryPlaceholders(keys.length)})`
      const params = keys.map(key => forDB[key])
      await trans.executeSql(query, params)
    })
  },

  /**
   * @param {Alert} alert
   */
  async saveAlert(alert) {
    await sqliteDB.transaction(async trans => {
      const forDB = Alert.toDB(alert)
      const keys = Object.keys(forDB)
      const query = `INSERT OR REPLACE INTO alerts (${keys.join(',')}) VALUES (${createQueryPlaceholders(keys.length)})`
      const params = keys.map(key => forDB[key])
      await trans.executeSql(query, params)
    })
  },

  /**
   * @return {Alert[]}
   */
  async findAlerts() {
    let alerts = []
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM alerts')
      const rows = result[1].rows
      alerts = rows.raw().map(Alert.fromDB)
    })
    return alerts
  }
}
