import SQLite from 'react-native-sqlite-storage'

import { database as databaseConfig } from '../config'

const SQLITE_ISO_8601_FORMAT = '%Y-%m-%dT%H:%M:%fZ'

SQLite.DEBUG(databaseConfig.DEBUG)
SQLite.enablePromise(true)

let sqliteDB = null

export async function open() {
  sqliteDB = await SQLite.openDatabase({ name: 'pedro.sqlite', location: 'default' })
  await migrate(sqliteDB)
  return { client }
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
  })
}

export const client = {
  async deleteAll() {
    await sqliteDB.transaction(async trans => {
      trans.executeSql('DELETE FROM stocks')
      trans.executeSql('DELETE FROM users')
    })
  },

  async findUser({ uuid }) {
    let user = null
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM users WHERE uuid=?', [uuid])
      const rows = result[1].rows
      user = rows.length > 0 ? rows.item(0) : null
    })
    return user
  },

  async saveUser({ uuid, password, apns_key }) {
    await sqliteDB.transaction(async trans => {
      const query = 'INSERT OR REPLACE INTO users (uuid, password, apns_key, updated_at) VALUES (?, ?, ?, ?)'
      const params = [uuid, password, apns_key, new Date().toISOString()]
      const result = await trans.executeSql(query, params)
      console.log('result', result)
    })
  },

  async findStocks() {
    let stocks = []
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM stocks')
      const rows = result[1].rows
      stocks = rows.raw()
    })
    return stocks
  },

  async findStock({ symbol }) {
    let stock = null
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM stocks WHERE symbol=?', [symbol])
      const rows = result[1].rows
      stock = rows.length > 0 ? rows.item(0) : null
    })
    return stock
  },

  async findLastUpdatedStock() {
    let stock = null
    await sqliteDB.readTransaction(async trans => {
      const result = await trans.executeSql('SELECT * FROM stocks ORDER BY updated_at DESC LIMIT 1')
      const rows = result[1].rows
      stock = rows.length > 0 ? rows.item(0) : null
    })
    return stock
  },

  async saveStock({ symbol, name, as_of, price, percent_change, updated_at }) {
    await sqliteDB.transaction(async trans => {
      const query = 'INSERT OR REPLACE INTO stocks (symbol, name, as_of, price, percent_change, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
      const params = [symbol, name, as_of, price, percent_change, updated_at]
      const result = await trans.executeSql(query, params)
      console.log('result', result)
    })
  }
}
