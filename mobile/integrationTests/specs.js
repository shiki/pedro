/* eslint-disable global-require */

import * as ids from './specIDs'

import dbSpec from './specs/db.spec'
import uuidGeneratorSpec from './specs/uuidGenerator.spec'

export default [{ id: ids.DB, fn: dbSpec }, { id: ids.UUID_GENERATOR, fn: uuidGeneratorSpec }]
