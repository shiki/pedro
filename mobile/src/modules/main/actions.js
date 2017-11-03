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

export function stocksLoadedFromDb(stocks) {
  return { type: types.STOCKS_LOADED_FROM_DB, payload: stocks }
}

export function stocksFetchFulfilled(stocks) {
  return { type: types.STOCKS_FETCH_FULFILLED, payload: stocks }
}
