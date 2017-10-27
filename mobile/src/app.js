/* eslint-disable global-require */

import { load as loadIcons } from './services/icons'
import { open as openDatabase } from './services/db'

import { sessionLoadStart } from './modules/main/actions'

import buildStore from './buildStore'
import registerScreens from './registerScreens'

import { shouldRunIntegrationApp } from './config'

export default async function bootstrap() {
  await loadIcons()

  const { client: database } = await openDatabase()

  const store = buildStore({ database })
  registerScreens(store)

  if (shouldRunIntegrationApp()) {
    require('../integrationTests/lib/IntegrationTestsApp')
    return null
  }

  return store.dispatch(sessionLoadStart())
}
