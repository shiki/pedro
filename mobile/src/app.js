/* eslint-disable global-require */

import { Navigation } from 'react-native-navigation'
import { createStore, applyMiddleware } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import DashboardScreen from './modules/dashboard/DashboardScreen'
import { loadIcons } from './icons'
import { loadDB } from './db'
import rootReducer from './reducers/rootReducer'
import { sessionLoad } from './actions'

import sessionLogic from './logics/sessionLogic'
import alertsLogic from './logics/alertsLogic'

export default async function bootstrap() {
  await loadIcons()
  const { realm } = await loadDB()

  const store = buildStore({ realm })
  registerScreens(store)

  store.dispatch(sessionLoad())

  Navigation.startSingleScreenApp({
    screen: {
      screen: 'screen.Dashboard',
      title: 'Pedro'
    }
  })
}

function registerScreens(store) {
  Navigation.registerComponent('screen.Dashboard', () => DashboardScreen, store, Provider)
}

function buildStore({ realm }) {
  const logicDeps = { realm }
  const logics = [sessionLogic, alertsLogic]
  const logicMiddleware = createLogicMiddleware(logics, logicDeps)

  let middleware = [thunk, logicMiddleware]

  if (__DEV__) {
    const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default()
    const logger = require('redux-logger').logger
    middleware = [...middleware, reduxImmutableStateInvariant, logger]
  }

  return createStore(rootReducer, applyMiddleware(...middleware))
}
