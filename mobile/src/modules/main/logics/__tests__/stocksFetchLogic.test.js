import { createMockStore } from 'redux-logic-test'
import UUIDGenerator from 'react-native-uuid-generator'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'

import { accessTokenFetchFulfilled, stocksFetchStart } from '../../actions'
import { STOCKS_FETCH_REJECTED, STOCKS_FETCH_FULFILLED } from '../../types'
import rootReducer from '../../../../rootReducer'
import { User, Stock } from '../../../../models'
import { database } from '../../../../services/db'
import * as api from '../../../../utils/api'

import { stocksFetchStartLogic, stocksFetchLogic } from '../stocksLogics'

// let store = null
let user = null
let stocks = null
let accessToken = null

beforeAll(async () => {
  user = new User({ uuid: await UUIDGenerator.getRandomUUID(), password: await UUIDGenerator.getRandomUUID() })
  const result = await api.postToken({ uuid: user.uuid, password: user.password })
  accessToken = result.access_token
})

beforeEach(() => {
  database.deleteAll()

  stocks = [
    { symbol: 'A', name: 'Alpha', price: 12, percent_change: 4, updated_at: moment('2017-01-01') },
    { symbol: 'B', name: 'Bravo', price: 12, percent_change: 4, updated_at: moment('2017-01-01') },
    { symbol: 'C', name: 'Charlie', price: 12, percent_change: 4, updated_at: moment('2017-01-01') }
  ].map(stock => {
    const { symbol, name, as_of, price, percent_change, updated_at } = stock
    return new Stock({
      symbol,
      name,
      as_of: as_of || moment(),
      price: new BigNumber(price),
      percent_change: new BigNumber(percent_change),
      updated_at: updated_at || moment()
    })
  })
  stocks.forEach(database.saveStock)

  jest.clearAllMocks()
})

it('loads the stocks from the db first', async () => {
  // Arrange
  expect(await database.findStocks()).toHaveLength(3)

  const store = createMockStore({ initialState: {}, reducer: rootReducer, logic: [stocksFetchLogic], injectedDeps: { database } })

  // Act
  store.dispatch(stocksFetchStart())

  // Assert
  return store.whenComplete(() => {
    // Dispatched action should be a "rejected" action because the access_token is invalid
    const action = store.actions[store.actions.length - 1]
    expect(action.type).toEqual(STOCKS_FETCH_REJECTED)

    // The stocks from the DB should have been stored in the state
    const listFromState = store.getState().stocks.list
    expect(listFromState).toHaveLength(3)
    expect(listFromState).toEqual(stocks)
  })
})

it('uses the latest updated stock when fetching', () => {
  // Arrange
  const initialState = { session: { user, accessToken } }
  const store = createMockStore({ initialState, reducer: rootReducer, logic: [stocksFetchStartLogic, stocksFetchLogic], injectedDeps: { database } })

  // Act
  // An access token fulfilled should immediately start a stock fetch
  store.dispatch(accessTokenFetchFulfilled(accessToken))

  // Assert
  return store.whenComplete(() => {
    const action = store.actions[store.actions.length - 1]
    expect(action.type).toEqual(STOCKS_FETCH_FULFILLED)
    expect(Array.isArray(action.payload)).toBeTruthy()

    expect(database.findLastUpdatedStock).toHaveBeenCalledTimes(1)

    // Assert the payload is a list of stocks
    action.payload.forEach(stock => expect(stock).toBeInstanceOf(Stock))
  })
})
