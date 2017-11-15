import { createLogic } from 'redux-logic'

import { ACCESS_TOKEN_FETCH_FULFILLED, ALERTS_FETCH_START, ALERTS_FETCH_FULFILLED, ALERTS_FETCH_REJECTED } from '../types'

const alertsFetchStartLogic = createLogic({
  type: ACCESS_TOKEN_FETCH_FULFILLED,
  processOptions: {
    successType: ALERTS_FETCH_START
  },
  process() {
    return null
  }
})

const alertsFetchLogic = createLogic({
  type: ALERTS_FETCH_START,

  processOptions: {
    successType: ALERTS_FETCH_FULFILLED,
    failType: ALERTS_FETCH_REJECTED
  },

  // TODO synchronize
  async process({ database }) {
    return database.findAlerts()
  }
})

export default [alertsFetchStartLogic, alertsFetchLogic]
