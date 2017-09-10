import { combineReducers } from 'redux'

import dashboardReducer from '../modules/dashboard/dashboardReducer'
import { SESSION_TOKEN_LOAD_SUCCESS, SESSION_TOKEN_LOAD_START, ALERTS_LOAD_SUCCESS } from '../actions'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  alerts: alertsReducer,
  session: sessionReducer
})

function sessionReducer(state = {}, action) {
  switch (action.type) {
    case SESSION_TOKEN_LOAD_START:
      return { ...state, user: action.payload }
    case SESSION_TOKEN_LOAD_SUCCESS: {
      const { user, accessToken } = action.payload
      return {
        ...state,
        accessToken,
        user: user || state.user
      }
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
