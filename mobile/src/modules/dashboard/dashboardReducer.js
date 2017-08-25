import { LOAD_ALERTS_SUCCESS } from './types'

export default function dashboardReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_ALERTS_SUCCESS:
      return { ...state, list: action.payload }
    default:
      return state
  }
}
