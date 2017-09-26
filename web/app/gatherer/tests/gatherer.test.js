import nock from 'nock'
import _ from 'lodash'
import { BigNumber } from 'bignumber.js'
import moment from 'moment'

import { apiUrls, convertStockFromApiToDbCompatible, fetchStocks, gather, saveStock, stocksAreEqual, filterFetchedStocks } from '../gatherer'
import DB from '../../services/DB'
import fixtures from '../../tests/fixtures'

beforeEach(() => fixtures.reset())

describe('stock conversion from api to db', () => {
  const asOf = new Date()
  const fromApi = {
    name: '2GO Group',
    price: {
      currency: 'PHP',
      amount: 20.35
    },
    percent_change: -1.45,
    volume: 55100,
    symbol: '2GO'
  }

  it('can convert to db-compatible', () => {
    const converted = convertStockFromApiToDbCompatible(fromApi, asOf)
    expect(converted).not.toBeNull()
    expect(_.sortBy(Object.keys(converted))).toEqual(['as_of', 'name', 'percent_change', 'price', 'symbol'])

    expect(converted.as_of).toBeInstanceOf(Date)
    expect(converted.as_of).toEqual(asOf)

    expect(converted.name).toBe(fromApi.name)

    expect(typeof converted.percent_change).toBe('string')
    expect(new BigNumber(converted.percent_change).equals(fromApi.percent_change)).toBeTruthy()

    expect(typeof converted.price).toBe('string')
    expect(new BigNumber(converted.price).eq(fromApi.price.amount)).toBeTruthy()

    expect(converted.symbol).toBe(fromApi.symbol)
  })

  it('converts numbers up to 6 decimal points', () => {
    const input = Object.assign({}, fromApi)
    input.price.amount = 20.1234567
    input.percent_change = -1.333

    const converted = convertStockFromApiToDbCompatible(input, asOf)
    expect(converted.price).toBe('20.123457')
    expect(converted.percent_change).toBe('-1.333')
  })

  it('never uses exponential notation when converting numbers to string', () => {
    const input = { ...Object.assign({}, fromApi), percent_change: 0.000000123 }

    const converted = convertStockFromApiToDbCompatible(input, asOf)
    expect(converted.percent_change).toBe('0')
  })

  it('throws an exception if it receives an unexpected object', () => {
    const input = { ...Object.assign({}, fromApi), percent_change: '123' }
    expect(() => {
      convertStockFromApiToDbCompatible(input, asOf)
    }).toThrow()
  })
})

describe('fetch', () => {
  beforeEach(() => {
    nock.disableNetConnect()
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  it('returns a pre-processed list of stocks', async () => {
    // Arrange
    nock(apiUrls.stocks).get('').reply(200, fixtures.phisixStocksJSON(), { 'Content-Type': 'application/json' })

    // Act
    const fetched = await fetchStocks()

    // Assert
    expect(fetched.length).toBeGreaterThan(50)

    fetched.forEach(stock => {
      expect(_.sortBy(Object.keys(stock))).toEqual(['as_of', 'name', 'percent_change', 'price', 'symbol'])
      expect(stock.as_of).toBeInstanceOf(Date)
      expect(typeof stock.name).toBe('string')
      expect(typeof stock.percent_change).toBe('string')
      expect(new BigNumber(stock.percent_change).isNaN()).toBeFalsy()
      expect(typeof stock.price).toBe('string')
      expect(new BigNumber(stock.price).isNaN()).toBeFalsy()
      expect(typeof stock.symbol).toBe('string')
    })

    let stock = fetched[0]
    expect(stock.as_of).toBeInstanceOf(Date)
    expect(stock.name).toBe('2GO Group')
    expect(stock.symbol).toBe('2GO')
    expect(stock.percent_change).toBe('-1.45')
    expect(stock.price).toBe('20.35')

    stock = fetched[fetched.length - 1]
    expect(stock.as_of).toBeInstanceOf(Date)
    expect(stock.name).toBe('Mining and Oil')
    expect(stock.symbol).toBe('M-O')
    expect(stock.percent_change).toBe('1.28')
    expect(stock.price).toBe('180.57')
  })

  it('returns null if it fails', async () => {
    nock(apiUrls.stocks).get('').reply(400, fixtures.phisixStocksJSON(), { 'Content-Type': 'application/json' })

    const fetched = await fetchStocks()
    expect(fetched).toBeNull()
  })

  it('returns null if the data is malformed', async () => {
    nock(apiUrls.stocks).get('').reply(200, '{ "stock": { } }', { 'Content-Type': 'application/json' })

    const fetched = await fetchStocks()
    expect(fetched).toBeNull()
  })
})

describe('filterFetchedStocks', async () => {
  let stocks = null

  beforeEach(async () => {
    stocks = filterFetchedStocks(await fetchStocks())
  })

  it('does not include ALL and PSE', () => {
    stocks.forEach(stock => {
      expect(['ALL', 'PSE']).not.toContain(stock.symbol)
    })
  })

  it('renames CEB', () => {
    const ceb = stocks.find(stock => stock.symbol === 'CEB')
    expect(ceb).not.toBeNull()
    expect(ceb.name).toBe('Cebu Air Inc.')
  })
})

describe('stocksAreEqual', () => {
  const left = {
    as_of: new Date(),
    name: 'Banco de Oro',
    percent_change: '-0.69',
    price: '128.9',
    symbol: 'BDO'
  }

  it('returns true if they are equal', () => {
    const right = { ...left }
    expect(stocksAreEqual(left, right)).toBeTruthy()
  })

  it('throws an exception if symbols are not the same', () => {
    const right = { ...left, symbol: 'B' }
    expect(() => stocksAreEqual(left, right)).toThrow()
  })

  it('throws an exception if the data types are incorrect', () => {
    const right = { ...left, percent_change: -0.69 }
    expect(() => stocksAreEqual(left, right)).toThrow()
  })

  it('does not use created_at and updated_at when comparing', () => {
    const a = { ...left, created_at: new Date(), updated_at: new Date() }
    const b = { ...a, created_at: moment(a.created_at).add(1, 'd').toDate() }
    expect(stocksAreEqual(a, b)).toBeTruthy()
  })
})

describe('saveStock', () => {
  const bdo = {
    as_of: new Date(),
    name: 'Banco de Oro',
    percent_change: '-0.69',
    price: '128.9',
    symbol: 'BDO'
  }

  it('saves new if it does not exist in the db', async () => {
    expect(await DB.shared.stocks.count()).toBe('0')

    const { stock, changed } = await saveStock(bdo)
    expect(stock).not.toBeNull()
    expect(stock.created_at).toBeInstanceOf(Date)
    expect(stock.updated_at).toBeInstanceOf(Date)
    expect(changed).toBeTruthy()

    expect(await DB.shared.stocks.count()).toBe('1')

    const fetched = await DB.shared.stocks.findOne({ symbol: stock.symbol })
    expect(fetched).not.toBeNull()
  })

  it('updates an existing stock if it already exists', async () => {
    let result = await saveStock(bdo)

    const updated = { ...result.stock, price: '300.0102' }
    result = await saveStock(updated)

    expect(result.changed).toBeTruthy()
    expect(new BigNumber(result.stock.price)).toEqual(new BigNumber('300.0102'))
    expect(result.stock.updated_at).not.toBe(updated.updated_at)
    expect(moment(result.stock.updated_at).isAfter(updated.updated_at)).toBeTruthy()

    expect(await DB.shared.stocks.count()).toBe('1')
  })

  it('does nothing if nothing changed', async () => {
    let result = await saveStock(bdo)
    expect(result.changed).toBeTruthy()

    result = await saveStock(bdo)
    expect(result.changed).toBeFalsy()

    result = await saveStock({ ...bdo, created_at: new Date() })
    expect(result.changed).toBeFalsy()
  })
})

describe('gather', () => {
  beforeEach(() => {
    nock.disableNetConnect()
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  it('fetches and saves the list of stocks', async () => {
    // Arrange
    nock(apiUrls.stocks).get('').reply(200, fixtures.phisixStocksJSON(), { 'Content-Type': 'application/json' })

    expect(await DB.shared.stocks.count()).toBe('0')

    // Act
    await gather()

    expect(await DB.shared.stocks.count()).toBe('252')
  })
})
