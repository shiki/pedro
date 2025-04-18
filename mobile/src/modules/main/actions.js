import * as types from './types'

export function sessionLoadStart() {
  return { type: types.SESSION_LOAD_START }
}

export function sessionLoadFulfilled(user) {
  return { type: types.SESSION_LOAD_FULFILLED, payload: user }
}

export function accessTokenFetchStart(user) {
  return { type: types.ACCESS_TOKEN_FETCH_START, payload: user }
}

export function accessTokenFetchFulfilled(accessToken) {
  return { type: types.ACCESS_TOKEN_FETCH_FULFILLED, payload: accessToken }
}

export function stocksFetchStart() {
  return { type: types.STOCKS_FETCH_START }
}

/**
 * @param {Object.<string, Stock>} stocksMap Map of symbol -> Stock
 */
export function stocksLoadedFromDb(stocksMap) {
  return { type: types.STOCKS_LOADED_FROM_DB, payload: stocksMap }
}

/**
 * @param {Object.<string, Stock>} stocksMap Map of symbol -> Stock
 */
export function stocksFetchFulfilled(stocksMap) {
  return { type: types.STOCKS_FETCH_FULFILLED, payload: stocksMap }
}

export function stocksFetchRejected(error) {
  return { type: types.STOCKS_FETCH_REJECTED, payload: error }
}

/**
 * @param {Object} param
 * @param {Object} param.navigator React Native Navigation
 * @param {Stock} param.stock
 * @param {string} param.price
 * @param {string} param.operator
 */
export function alertsSaveStart({ navigator, stock, price, operator }) {
  return { type: types.ALERTS_SAVE_START, payload: { navigator, stock, price, operator } }
}

/**
 * @param {Object} param
 * @param {Object} param.navigator React Native Navigation
 * @param {Alert} param.alert
 */
export function alertsSaveFulfilled({ navigator, alert }) {
  return { type: types.ALERTS_SAVE_FULFILLED, payload: { navigator, alert } }
}
