export const ADD_BUTTON_PRESSED = 'dashboard/ADD_BUTTON_PRESSED'

export function addButtonPressed({ navigator }) {
  return { type: ADD_BUTTON_PRESSED, payload: { navigator } }
}
