import { createLogic } from 'redux-logic'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'

import { number as numberConfig } from '../../../config'
import * as api from '../../../utils/api'

import * as types from '../types'
import * as actions from '../actions'

const stocksFetchStartLogic = createLogic({
  type: types.ACCESS_TOKEN_FETCH_FULFILLED,
  processOptions: {
    successType: types.STOCKS_FETCH_START
  },
  process() {
    return null
  }
})

const stocksFetchLogic = createLogic({
  type: types.STOCKS_FETCH_START,
  latest: true,

  // TODO throw failure if no stocks ever get loaded
  async process({ getState, database }, dispatch, done) {
    // If there is no state set yet, load from DB
    if (!getState().stocks.loadedFromDb) {
      const stocks = await database.findStocks()
      await dispatch(actions.stocksLoadedFromDb(stocks))
    }

    const stocks = await fetchAndSaveStocks({ getState, database })
    dispatch(actions.stocksFetchFulfilled(stocks))
    done()
  }
})

async function fetchAndSaveStocks({ getState, database }) {
  const { accessToken } = getState().session
  const updatedAfter = await (async () => {
    const lastUpdatedStock = await database.findLastUpdatedStock()
    return lastUpdatedStock != null ? lastUpdatedStock.updated_at : null
  })()

  const fetchedList = await api.getStocks({ accessToken, updatedAfter })

  return Promise.all(
    fetchedList.map(async fetchedStock => {
      const properties = {
        as_of: moment(fetchedStock.as_of).toISOString(),
        name: fetchedStock.name,
        percent_change: new BigNumber(fetchedStock.percent_change).toFixed(numberConfig.DECIMAL_PLACES),
        price: new BigNumber(fetchedStock.price).toFixed(numberConfig.DECIMAL_PLACES),
        symbol: fetchedStock.symbol,
        updated_at: moment(fetchedStock.updated_at).toISOString()
      }

      await database.saveStock(properties)
      const saved = await database.findStock({ symbol: properties.symbol })
      return saved
    })
  )
}

export default [stocksFetchStartLogic, stocksFetchLogic]
