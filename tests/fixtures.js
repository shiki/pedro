/**
 * Utility functions for setting up initial data in tests
 */

const db = require('../services/db')

/**
 * Reset the database
 */
async function reset() {
  return db.bootstrap().then(async database => {
    await database.users.destroy({})
  })
}

module.exports = {
  reset: reset
}