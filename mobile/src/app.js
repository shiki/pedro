/* eslint-disable global-require */

import { Navigation } from 'react-native-navigation'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import DashboardScreen from './modules/dashboard/DashboardScreen'
import { loadIcons } from './icons'
import rootReducer from './reducers/rootReducer'

export default async function bootstrap() {
  await loadIcons()

  const store = buildStore()
  registerScreens(store)

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

function buildStore() {
  let middleware = [thunk]

  if (__DEV__) {
    const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default()
    const logger = require('redux-logger').logger
    middleware = [...middleware, reduxImmutableStateInvariant, logger]
  }

  return createStore(rootReducer, applyMiddleware(...middleware))
}
