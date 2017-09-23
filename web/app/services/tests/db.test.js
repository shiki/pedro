import _ from 'lodash'
import { BigNumber } from 'bignumber.js'

import DB from '../DB'
import fixtures from '../../tests/fixtures'

beforeEach(() => fixtures.reset())

test('can connect', () => {
  const database = DB.shared
  expect(database.users).not.toBeFalsy()
  expect(database.alerts).not.toBeFalsy()
  expect(database.stocks).not.toBeFalsy()
})

test('can create a user', async done => {
  const uuid = 'ef4ab34d-0b79-46bf-8ae8-3ee8927c8379'
  const database = DB.shared

  let found = await database.users.find({ uuid })
  expect(found.length).toBe(0)

  const created = await database.users.insert({ uuid, apns_key: null })
  expect(created).not.toBeNull()
  expect(created.uuid).toBe(uuid)
  expect(created.apns_key).toBeNull()
  expect(created.updated_at).not.toBeFalsy()
  expect(created.created_at).not.toBeFalsy()
  expect(created.updated_at).toBeInstanceOf(Date)

  found = await database.users.find({ uuid })
  expect(found.length).toBe(1)
  expect(found[0].uuid).toBe(uuid)

  done()
})

test('can create a stock', async done => {
  const input = {
    as_of: new Date('2008-09-15T15:53:00'),
    name: 'ABS-CBN',
    percent_change: -0.37,
    price: 40.7,
    symbol: 'ABS'
  }

  const saved = await DB.shared.stocks.insert(input)
  expect(saved).not.toBeNull()
  expect(_.sortBy(Object.keys(saved))).toEqual([
    'as_of',
    'created_at',
    'name',
    'percent_change',
    'price',
    'symbol',
    'updated_at'
  ])

  expect(saved.as_of).toBeInstanceOf(Date)
  expect(saved.as_of).toEqual(input.as_of)

  expect(saved.created_at).not.toBeNull()
  expect(saved.created_at).toBeInstanceOf(Date)

  expect(saved.name).toBe(input.name)

  expect(typeof saved.percent_change).toBe('string')
  expect(new BigNumber(saved.percent_change).eq(input.percent_change)).toBeTruthy()

  expect(typeof saved.price).toBe('string')
  expect(new BigNumber(saved.price).eq(input.price)).toBeTruthy()

  expect(saved.symbol).toBe(input.symbol)

  expect(saved.updated_at).not.toBeNull()
  expect(saved.updated_at).toBeInstanceOf(Date)

  done()
})

test('can create a user without giving a uuid', async done => {
  const database = DB.shared

  const created = await database.users.insert({ apns_key: null })
  expect(created).not.toBeNull()
  expect(created.uuid).not.toBeFalsy()

  done()
})
