import { CANCEL_BUTTON_PRESSED, STOCK_SELECTED } from './types'

export function cancelButtonPressed({ navigator }) {
  return { type: CANCEL_BUTTON_PRESSED, payload: { navigator } }
}

/**
 * @param {Object} param
 * @param {Object} param.navigator
 * @param {Stock} param.stock
 */
export function stockSelected({ navigator, stock }) {
  return { type: STOCK_SELECTED, payload: { navigator, stock } }
}
