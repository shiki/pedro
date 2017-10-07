import alertsLogic from './alertsLogic'
import sessionLogics from './sessionLogics'
import dashboardLogics from '../modules/dashboard/logics'

export default [alertsLogic, ...sessionLogics, ...dashboardLogics]
