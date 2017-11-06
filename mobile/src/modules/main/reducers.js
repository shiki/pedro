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

const STOCKS_REDUCER_INITIAL_STATE = { list: [], loadedFromDb: false }
const stockComparator = (left, right) => left.symbol.localeCompare(right.symbol)

export function stocksReducer(state = STOCKS_REDUCER_INITIAL_STATE, action) {
  switch (action.type) {
    case types.STOCKS_LOADED_FROM_DB:
      return { ...state, loadedFromDb: true, list: action.payload.slice().sort(stockComparator) }
    case types.STOCKS_FETCH_FULFILLED: {
      // Map of newly updated { symbol: Stock }
      const map = action.payload.reduce((prev, stock) => ({ ...prev, [stock.symbol]: stock }), {})
      // Replace existing stocks. Mutate `map` to identify if there are new ones
      let list = state.list.map(stock => {
        if (map[stock.symbol]) {
          const newStock = map[stock.symbol]
          delete map[stock.symbol]
          return newStock
        }
        return stock
      })
      // Merge remaining stocks in `map` into `list` and sort
      list = [...list, ...Object.values(map)].sort(stockComparator)

      return { ...state, list }
    }
    default:
      return state
  }
}
