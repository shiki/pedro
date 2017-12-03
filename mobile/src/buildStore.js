/* eslint-disable global-require */

import { createStore, applyMiddleware } from 'redux'
import { createLogicMiddleware } from 'redux-logic'

import rootReducer from './rootReducer'
import logics from './logics'

export default function buildStore() {
  const logicMiddleware = createLogicMiddleware(logics, {})

  let middleware = [logicMiddleware]

  if (__DEV__) {
    const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default()
    const logger = require('redux-logger').logger
    middleware = [...middleware, reduxImmutableStateInvariant, logger]
  }

  return createStore(rootReducer, applyMiddleware(...middleware))
}
