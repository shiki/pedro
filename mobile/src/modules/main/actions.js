import * as types from './types'

export function sessionLoadStart() {
  return { type: types.SESSION_LOAD_START }
}

export function stocksFetchStart() {
  return { type: types.STOCKS_FETCH_START }
}

export function stocksLoadedFromDb(stocks) {
  return { type: types.STOCKS_LOADED_FROM_DB, payload: stocks }
}

export function stocksFetchFulfilled(stocks) {
  return { type: types.STOCKS_FETCH_FULFILLED, payload: stocks }
}
