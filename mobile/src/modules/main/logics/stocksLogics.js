import { createLogic } from 'redux-logic'

import { Stock } from '../../../models'

import * as api from '../../../utils/api'

import * as types from '../types'
import * as actions from '../actions'

export const stocksFetchStartLogic = createLogic({
  type: types.ACCESS_TOKEN_FETCH_FULFILLED,
  processOptions: {
    successType: actions.stocksFetchStart
  },
  process() {
    return null
  }
})

export const stocksFetchLogic = createLogic({
  type: types.STOCKS_FETCH_START,
  latest: true,

  // TODO throw failure if no stocks ever get loaded
  async process({ getState, database }, dispatch, done) {
    try {
      // If there is no state set yet, load from DB
      if (!getState().stocks.loadedFromDb) {
        const stocks = await database.findStocks()
        await dispatch(actions.stocksLoadedFromDb(stocks))
      }

      const stocks = await fetchAndSaveStocks({ accessToken: getState().session.accessToken, database })
      dispatch(actions.stocksFetchFulfilled(stocks))
    } catch (error) {
      dispatch(actions.stocksFetchRejected(error))
    }
    done()
  }
})

async function fetchAndSaveStocks({ accessToken, database }) {
  const updatedAfter = await (async () => {
    const lastUpdatedStock = await database.findLastUpdatedStock()
    return lastUpdatedStock != null ? lastUpdatedStock.updated_at : null
  })()

  const fetchedList = await api.getStocks({ accessToken, updatedAfter })

  return Promise.all(
    fetchedList.map(async fetchedStock => {
      const toSave = Stock.fromAPI(fetchedStock)
      await database.saveStock(toSave)
      const saved = await database.findStock({ symbol: toSave.symbol })
      return saved
    })
  )
}

export const logics = [stocksFetchStartLogic, stocksFetchLogic]
