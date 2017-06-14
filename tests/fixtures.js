/**
 * Utility functions for setting up initial data in tests
 */

import * as db from '../services/db'

/**
 * Reset the database
 */
export async function reset() {
  return db.bootstrap().then(async database => {
    await database.users.destroy({})
  })
}
