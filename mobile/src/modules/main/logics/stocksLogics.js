import { createLogic } from 'redux-logic'

import { database } from '../../../services/db'
import * as api from '../../../utils/api'

import { Stock } from '../../../models'

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

  async process({ getState }, dispatch, done) {
    try {
      // If there is no state set yet, load from DB
      if (!getState().stocks.loadedFromDb) {
        const map = stocksListToMap(await database.findStocks())
        await dispatch(actions.stocksLoadedFromDb(map))
      }

      const map = stocksListToMap(await fetchAndSaveStocks({ accessToken: getState().session.accessToken }))
      dispatch(actions.stocksFetchFulfilled(map))
    } catch (error) {
      dispatch(actions.stocksFetchRejected(error))
    }
    done()
  }
})

async function fetchAndSaveStocks({ accessToken }) {
  const updatedAfter = await (async () => {
    const lastUpdatedStock = await database.findLastUpdatedStock()
    return lastUpdatedStock != null ? lastUpdatedStock.updated_at : null
  })()

  const fetchedList = await api.getStocks({ accessToken, updatedAfter })

  return Promise.all(
    fetchedList.map(async fetchedStock => {
      const toSave = Stock.fromAPI(fetchedStock)
      await database.saveStock(toSave)
      const saved = await database.findStock(toSave.symbol)
      return saved
    })
  )
}

/**
 * @param {Stock[]} list
 * @return {Object.<string, Stock>}
 */
function stocksListToMap(list) {
  return list.reduce((map, stock) => ({ ...map, [stock.symbol]: stock }), {})
}

export const logics = [stocksFetchStartLogic, stocksFetchLogic]
