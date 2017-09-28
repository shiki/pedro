import querystring from 'querystring'
import uuidv4 from 'uuid/v4'
import { BigNumber } from 'bignumber.js'

import DB from '../../../services/DB'
import { server } from '../../api'
import fixtures from '../../../tests/fixtures'
import { generateToken } from '../../auth'

let request = null

beforeEach(async () => {
  await fixtures.reset()

  const stocks = [
    {
      symbol: '2GO',
      as_of: '2017-09-27T04:46:00.000Z',
      price: '20.300000',
      percent_change: '0.740000',
      updated_at: '2017-09-27T04:46:24.488Z',
      name: '2GO Group'
    },
    {
      symbol: 'AB',
      as_of: '2017-09-27T04:46:00.000Z',
      price: '16.160000',
      percent_change: '-5.500000',
      updated_at: '2017-09-27T04:46:24.490Z',
      name: 'Atok A'
    },
    {
      symbol: 'CEB',
      as_of: '2017-09-27T04:46:00.000Z',
      price: '108.000000',
      percent_change: '0.930000',
      updated_at: '2017-09-27T04:46:24.529Z',
      name: 'Cebu Air Inc.'
    }
  ]

  await DB.shared.stocks.insert(stocks)

  const user = await DB.shared.users.insert({ uuid: uuidv4() })
  const accessToken = generateToken(user)

  request = { method: 'GET', url: '/stocks', headers: { Authorization: `Bearer ${accessToken}` } }
})

test('returns all stocks by default', async () => {
  const res = await server.inject(request)

  expect(res.statusCode).toBe(200)

  const json = JSON.parse(res.payload)

  expect(Object.keys(json)).toEqual(['data'])
  expect(Object.keys(json.data)).toEqual(['stocks'])

  const stocks = json.data.stocks
  expect(stocks).toHaveLength(3)
  stocks.forEach(stock => {
    const expectedKeys = ['symbol', 'price', 'as_of', 'percent_change', 'updated_at', 'name']
    expect(Object.keys(stock)).toEqual(expect.arrayContaining(expectedKeys))
    expect(Object.keys(stock)).toHaveLength(expectedKeys.length)

    expect(typeof stock.symbol).toBe('string')
    expect(typeof stock.as_of).toBe('string')
    expect(typeof stock.updated_at).toBe('string')
    expect(typeof stock.name).toBe('string')
    expect(typeof stock.percent_change).toBe('string')
    expect(new BigNumber(stock.percent_change).isNaN()).toBeFalsy()
    expect(typeof stock.price).toBe('string')
    expect(new BigNumber(stock.price).isNaN()).toBeFalsy()
  })
})

test('responds with an error if the updated_after query is not a valid date format', async () => {
  request.url = `${request.url}?updated_after=123`

  const res = await server.inject(request)

  expect(res.statusCode).toBe(400)
  expect(res.result.message).toContain('must be a valid ISO 8601 date')
})

test('returns stocks updated after the given updated_after date', async () => {
  const twoGoUpdatedAt = '2017-09-27T04:46:24.488Z'
  request.url = `${request.url}?updated_after=${querystring.escape(twoGoUpdatedAt)}`

  const res = await server.inject(request)

  expect(res.statusCode).toBe(200)

  const stocks = res.result.data.stocks
  expect(stocks).toHaveLength(2)
  stocks.forEach(stock => {
    expect(['AB', 'CEB']).toContain(stock.symbol)
  })
})
