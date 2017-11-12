import { SAVE_BUTTON_PRESSED, BACK_BUTTON_PRESSED, CANCEL_BUTTON_PRESSED, STOCK_SELECTED } from './types'

export function cancelButtonPressed({ navigator }) {
  return { type: CANCEL_BUTTON_PRESSED, payload: { navigator } }
}

export function backButtonPressed({ navigator }) {
  return { type: BACK_BUTTON_PRESSED, payload: { navigator } }
}

export function saveButtonPressed({ navigator }) {
  return { type: SAVE_BUTTON_PRESSED, payload: { navigator } }
}

/**
 * @param {Object} param
 * @param {Object} param.navigator
 * @param {Stock} param.stock
 */
export function stockSelected({ navigator, stock }) {
  return { type: STOCK_SELECTED, payload: { navigator, stock } }
}
