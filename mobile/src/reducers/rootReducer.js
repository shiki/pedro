import { combineReducers } from 'redux'

import dashboardReducer from '../modules/dashboard/dashboardReducer'
import { SESSION_CHANGED, ALERTS_LOAD_SUCCESS } from '../actions'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  alerts: alertsReducer,
  session: sessionReducer
})

function sessionReducer(state = {}, action) {
  switch (action.type) {
    case SESSION_CHANGED: {
      const { user, jwt } = action.payload
      return { ...state, user, jwt }
    }
    default:
      return state
  }
}

function alertsReducer(state = {}, action) {
  switch (action.type) {
    case ALERTS_LOAD_SUCCESS:
      return { ...state, list: action.payload }
    default:
      return state
  }
}

export default rootReducer
