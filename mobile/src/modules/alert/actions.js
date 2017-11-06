import { CANCEL_BUTTON_PRESSED } from './types'

export function cancelButtonPressed({ navigator }) {
  return { type: CANCEL_BUTTON_PRESSED, payload: { navigator } }
}

export default { cancelButtonPressed }
