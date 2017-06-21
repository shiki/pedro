import * as db from '../db'
import { reset } from '../../tests/fixtures'

beforeEach(() => reset())

test('can connect', () => {
  const database = db.shared()
  expect(database.users).not.toBeFalsy()
  expect(database.alerts).not.toBeFalsy()
  expect(database.stocks).not.toBeFalsy()
})

test('can create a user', async done => {
  const uuid = 'ef4ab34d-0b79-46bf-8ae8-3ee8927c8379'
  const database = db.shared()

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

test('can create a user without giving a uuid', async done => {
  const database = db.shared()

  const created = await database.users.insert({ apns_key: null })
  expect(created).not.toBeNull()
  expect(created.uuid).not.toBeFalsy()

  done()
})
