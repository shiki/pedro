import * as types from './types'

export function cancelButtonPressed({ navigator }) {
  return { type: types.CANCEL_BUTTON_PRESSED, payload: { navigator } }
}

export function backButtonPressed({ navigator }) {
  return { type: types.BACK_BUTTON_PRESSED, payload: { navigator } }
}

export function alertSaveStart({ navigator, stock, price, operator }) {
  return { type: types.ALERT_SAVE_START, payload: { navigator, stock, price, operator } }
}

export function alertSaveFulfilled({ navigator, alert }) {
  return { type: types.ALERT_SAVE_FULFILLED, payload: { navigator, alert } }
}

/**
 * @param {Object} param
 * @param {Object} param.navigator
 * @param {Stock} param.stock
 */
export function stockSelected({ navigator, stock }) {
  return { type: types.STOCK_SELECTED, payload: { navigator, stock } }
}
