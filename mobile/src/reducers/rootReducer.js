import { combineReducers } from 'redux'

import dashboardReducer from '../modules/dashboard/dashboardReducer'
import alertsReducer from './alertsReducer'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  alerts: alertsReducer
})

export default rootReducer
