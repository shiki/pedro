import { combineReducers } from 'redux'

import { sessionReducer, alertsReducer, stocksReducer } from './modules/main/reducers'

const rootReducer = combineReducers({
  alerts: alertsReducer,
  session: sessionReducer,
  stocks: stocksReducer
})

export default rootReducer
