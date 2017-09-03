import { combineReducers } from 'redux'

import dashboardReducer from '../modules/dashboard/dashboardReducer'
import { AUTH_USER_CHANGED, ALERTS_LOAD_SUCCESS } from '../actions'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  alerts: alertsReducer,
  session: sessionReducer
})

function sessionReducer(state = {}, action) {
  switch (action.type) {
    case AUTH_USER_CHANGED:
      return { ...state, user: action.payload }
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
