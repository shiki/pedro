import { ALERTS_LOAD_SUCCESS } from '../actions'

export default function alertsReducer(state = {}, action) {
  switch (action.type) {
    case ALERTS_LOAD_SUCCESS:
      return { ...state, list: action.payload }
    default:
      return state
  }
}
