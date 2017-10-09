import * as types from './types'

export function addButtonPressed({ navigator }) {
  return { type: types.ADD_BUTTON_PRESSED, payload: { navigator } }
}

export default { addButtonPressed }
