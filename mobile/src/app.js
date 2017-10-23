/* eslint-disable global-require */

import { load as loadIcons } from './services/icons'
import { open as openDatabase } from './services/db'

import { sessionLoadStart } from './modules/main/actions'

import buildStore from './buildStore'
import registerScreens from './registerScreens'

export default async function bootstrap() {
  await loadIcons()

  const { client: database } = await openDatabase()

  const store = buildStore({ database })
  registerScreens(store)

  require('../integrationTests/IntegrationTestsApp')

  // return store.dispatch(sessionLoadStart())
}
