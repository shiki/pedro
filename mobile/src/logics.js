import mainLogics from './modules/main/logics'
import alertLogics from './modules/alert/logics'
import navigationLogics from './navigationLogics'

export default [...navigationLogics, ...mainLogics, ...alertLogics]
