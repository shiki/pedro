import DB from '../../../services/DB'
import { server } from '../../api'
import fixtures from '../../../tests/fixtures'
import constants from '../../../constants'
import { verifyToken } from '../../auth'

import { protectPassword } from '../token'

let request = null

beforeEach(() => {
  request = { method: 'POST', url: '/token' }
  return fixtures.reset()
})

test('responds with an error if no params are given', async () => {
  const res = await server.inject(request)
  expect(res.statusCode).toBe(400)
  expect(res.result.error).toBe('Bad Request')
})

test('responds with an error if the parameters are invalid', async () => {
  const req = { ...request, ...{ payload: { uuid: 'aaa' } } }
  let res = await server.inject(req)
  expect(res.statusCode).toBe(400)
  expect(res.result.message).toBe('Missing or invalid uuid')

  req.payload = { uuid: '87b81351-f4a2-4988-ab34-3cca91ee5dfb', password: 'pw' }
  res = await server.inject(req)
  expect(res.statusCode).toBe(400)
  expect(res.result.message).toBe('Invalid grant_type')
})

test('only allows predefined client_id values', async () => {
  const req = {
    ...request,
    ...{
      payload: {
        uuid: '87b81351-f4a2-4988-ab34-3cca91ee5dfb',
        password: 'pw',
        grant_type: 'anon',
        client_id: 'invalid'
      }
    }
  }
  const res = await server.inject(req)
  expect(res.statusCode).toBe(401)
})

test('creates a new user if the uuid is new', async () => {
  // Arrange
  expect(await DB.shared.users.count()).toBe('0')

  // Act
  const req = {
    ...request,
    ...{
      payload: {
        uuid: '87b81351-f4a2-4988-ab34-3cca91ee5dfb',
        password: 'pw',
        grant_type: 'anon',
        client_id: constants.CLIENT_IDS[0]
      }
    }
  }
  const res = await server.inject(req)
  expect(res.statusCode).toBe(200)

  // Assert
  const payload = JSON.parse(res.payload)

  expect(await DB.shared.users.count()).toBe('1')
  const user = await DB.shared.users.findOne()

  const accessToken = verifyToken(payload.access_token)
  expect(Object.keys(accessToken)).toEqual(['version', 'sub', 'iat', 'iss'])
  expect(accessToken.sub).toBe(user.uuid)
  expect(accessToken.version).toBe('1')
  expect(accessToken.iat).toBeTruthy()

  const userJSON = payload.user
  expect(Object.keys(userJSON)).toEqual(['uuid', 'created_at', 'updated_at'])
  expect(userJSON.uuid).toBe(user.uuid)
  expect(userJSON.created_at).toEqual(user.created_at.toJSON())
  expect(userJSON.updated_at).toEqual(user.updated_at.toJSON())
})

test('returns the user with the same uuid', async () => {
  // Arrange
  const uuid = '87b81351-f4a2-4988-ab34-3cca91ee5dfb'
  const user = await DB.shared.users.insert({ uuid, password: await protectPassword('pass') })
  expect(await DB.shared.users.count()).toBe('1')

  // Act
  const req = {
    ...request,
    ...{
      payload: { uuid, password: 'pass', grant_type: 'anon', client_id: constants.CLIENT_IDS[0] }
    }
  }
  const res = await server.inject(req)
  expect(res.statusCode).toBe(200)

  // Assert
  const payload = JSON.parse(res.payload)

  // No new user was created
  expect(await DB.shared.users.count()).toBe('1')

  const accessToken = verifyToken(payload.access_token)
  expect(Object.keys(accessToken)).toEqual(['version', 'sub', 'iat', 'iss'])
  expect(accessToken.sub).toBe(user.uuid)
  expect(accessToken.version).toBe('1')
  expect(accessToken.iat).toBeTruthy()

  const userJSON = payload.user
  expect(Object.keys(userJSON)).toEqual(['uuid', 'created_at', 'updated_at'])
  expect(userJSON.uuid).toBe(user.uuid)
  expect(userJSON.created_at).toEqual(user.created_at.toJSON())
  expect(userJSON.updated_at).toEqual(user.updated_at.toJSON())
})

test('does not return a token if the password does not match', async () => {
  // Arrange
  const uuid = '87b81351-f4a2-4988-ab34-3cca91ee5dfb'
  await DB.shared.users.insert({ uuid, password: await protectPassword('pass') })
  expect(await DB.shared.users.count()).toBe('1')

  // Act
  const req = {
    ...request,
    ...{
      payload: {
        uuid,
        password: 'invalid_password',
        grant_type: 'anon',
        client_id: constants.CLIENT_IDS[0]
      }
    }
  }
  const res = await server.inject(req)

  // Assert
  expect(res.statusCode).toBe(401)
  expect(res.result.message).toBe('Invalid credentials')
})
