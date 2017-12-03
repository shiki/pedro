/* eslint-disable global-require */

import * as ids from './specIDs'

import dbUsersSpec from './specs/dbUsers.spec'
import dbStocksSpec from './specs/dbStocks.spec'
import dbAlertsSpec from './specs/dbAlerts.spec'
import uuidGeneratorSpec from './specs/uuidGenerator.spec'

export default [
  { id: ids.DB_USERS, fn: dbUsersSpec },
  { id: ids.DB_STOCKS, fn: dbStocksSpec },
  { id: ids.DB_ALERTS, fn: dbAlertsSpec },
  { id: ids.UUID_GENERATOR, fn: uuidGeneratorSpec }
]
