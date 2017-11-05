import alertsLogics from './alertsLogics'
import { logics as sessionLogics } from './sessionLogics'
import { logics as stocksLogics } from './stocksLogics'

export default [...alertsLogics, ...sessionLogics, ...stocksLogics]
