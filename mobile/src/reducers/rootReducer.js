import { combineReducers } from 'redux'

import dashboardReducer from '../modules/dashboard/dashboardReducer'

const rootReducer = combineReducers({
  dashboard: dashboardReducer
})

export default rootReducer
