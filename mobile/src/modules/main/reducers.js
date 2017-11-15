import * as types from './types'

const SESSION_REDUCER_INITIAL_STATE = { user: null, accessToken: null }

export function sessionReducer(state = SESSION_REDUCER_INITIAL_STATE, action) {
  switch (action.type) {
    case types.SESSION_LOAD_FULFILLED:
      return { ...state, user: action.payload }
    case types.ACCESS_TOKEN_FETCH_FULFILLED: {
      return { ...state, accessToken: action.payload }
    }
    default:
      return state
  }
}

const ALERTS_REDUCER_INITIAL_STATE = { list: [] }

export function alertsReducer(state = ALERTS_REDUCER_INITIAL_STATE, action) {
  switch (action.type) {
    case types.ALERTS_FETCH_FULFILLED:
      return { ...state, list: action.payload }
    default:
      return state
  }
}

const STOCKS_REDUCER_INITIAL_STATE = { map: {}, loadedFromDb: false }

export function stocksReducer(state = STOCKS_REDUCER_INITIAL_STATE, action) {
  switch (action.type) {
    case types.STOCKS_LOADED_FROM_DB:
      return { ...state, loadedFromDb: true, map: Object.assign({}, state.map, action.payload) }
    case types.STOCKS_FETCH_FULFILLED: {
      return { ...state, map: Object.assign({}, state.map, action.payload) }
    }
    default:
      return state
  }
}
