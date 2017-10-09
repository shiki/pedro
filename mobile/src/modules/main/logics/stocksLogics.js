import { createLogic } from 'redux-logic'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'

import { Stock, toImmutable } from '../../../services/db'
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
  async process({ getState, realm }, dispatch, done) {
    // If there is no state set yet, load from DB
    if (!getState().stocks.loadedFromDb) {
      const stocks = realm.objects(Stock.name).map(toImmutable)
      await dispatch(actions.stocksLoadedFromDb(stocks))
    }

    const stocks = await fetchAndSaveStocks({ getState, realm })
    dispatch(actions.stocksFetchFulfilled(stocks))
    done()
  }
})

async function fetchAndSaveStocks({ getState, realm }) {
  const { accessToken } = getState().session
  const updatedAfter = (() => {
    const stocks = realm.objects(Stock.schema.name).sorted('updated_at', true)
    return stocks.length > 0 ? stocks[0].updated_after : null
  })()

  const fetchedList = await api.getStocks({ accessToken, updatedAfter })

  return fetchedList
    .map(fetchedStock => {
      const properties = {
        as_of: moment(fetchedStock.as_of).toDate(),
        name: fetchedStock.name,
        percent_change: new BigNumber(fetchedStock.percent_change).toNumber(),
        price: new BigNumber(fetchedStock.price).toNumber(),
        symbol: fetchedStock.symbol,
        updated_at: moment(fetchedStock.updated_at).toDate()
      }

      let saved = null
      realm.write(() => {
        saved = realm.create(Stock.schema.name, properties, true)
      })
      return saved
    })
    .map(toImmutable)
}

export default [stocksFetchStartLogic, stocksFetchLogic]
