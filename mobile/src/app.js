/* eslint-disable global-require */

import { Navigation } from 'react-native-navigation'
import { createStore, applyMiddleware } from 'redux'
import { createLogicMiddleware } from 'redux-logic'
import thunk from 'redux-thunk'

import { loadIcons } from './icons'
import { loadDB } from './db'
import rootReducer from './reducers/rootReducer'
import { sessionLoad } from './actions'
import { registerScreens } from './screens'

import logics from './logics'

export default async function bootstrap() {
  await loadIcons()
  const { realm } = await loadDB()

  const store = buildStore({ realm })
  registerScreens(store)

  await store.dispatch(sessionLoad())

  Navigation.startSingleScreenApp({
    screen: {
      screen: 'screen.Dashboard',
      title: 'Pedro'
    }
  })
}

function buildStore({ realm }) {
  const logicDeps = { realm }
  const logicMiddleware = createLogicMiddleware(logics, logicDeps)

  let middleware = [thunk, logicMiddleware]

  if (__DEV__) {
    const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default()
    const logger = require('redux-logger').logger
    middleware = [...middleware, reduxImmutableStateInvariant, logger]
  }

  return createStore(rootReducer, applyMiddleware(...middleware))
}
