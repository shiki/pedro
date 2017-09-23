/**
 * Utility functions for setting up initial data in tests
 */

import fs from 'fs'

import DB from '../../services/DB'

/**
 * Reset the database
 */
async function reset() {
  return DB.bootstrap().then(async database => {
    await database.users.destroy({})
    await database.stocks.destroy({})
  })
}

function phisixStocksJSON() {
  return fs.readFileSync(`${__dirname}/phisix-stocks.json`, 'utf8')
}

export default { reset, phisixStocksJSON }
