
import { server } from '../../server'
import { reset } from '../../tests/fixtures'
import constants from '../../constants'
import jwt from 'jsonwebtoken'
import { shared as db } from '../../services/db'

let request = null

beforeEach(() => {
  request = {method: 'POST', url: '/token'}
  return reset()
})

test('responds with an error if no params are given', async done => {
  const res = await server.inject(request)
  expect(res.statusCode).toBe(400)
  expect(res.result.error).toBe('Bad Request')
  done()
})

test('responds with an error if the parameters are invalid', async done => {
  let req = {...request, ...{payload: {anon_uuid: 'aaa'}}}
  let res = await server.inject(req)
  expect(res.statusCode).toBe(400)
  expect(res.result.message).toBe('Missing or invalid uuid')

  req.payload = {anon_uuid: '87b81351-f4a2-4988-ab34-3cca91ee5dfb'}
  res = await server.inject(req)
  expect(res.statusCode).toBe(400)
  expect(res.result.message).toBe('Invalid grant_type')

  done()
})

test('only allows predefined client_id values', async done => {
  let req = {...request, ...{
    payload: {
      anon_uuid: '87b81351-f4a2-4988-ab34-3cca91ee5dfb',
      grant_type: 'anon',
      client_id: 'invalid'
    }
  }}
  let res = await server.inject(req)
  expect(res.statusCode).toBe(401)
  done()
})

test('creates a new user if the anon_uuid is new', async done => {
  // Arrange
  expect(await db().users.count()).toBe("0")

  // Act
  const req = {...request, ...{
    payload: {
        anon_uuid: '87b81351-f4a2-4988-ab34-3cca91ee5dfb',
        grant_type: 'anon',
        client_id: constants.clientIds[0]
    }
  }}
  const res = await server.inject(req)
  expect(res.statusCode).toBe(200)

  // Assert
  const payload = JSON.parse(res.payload)

  expect(await db().users.count()).toBe("1")
  const user = await db().users.findOne()

  const accessToken = jwt.verify(payload.access_token, constants.jwtSecretKey)
  expect(Object.keys(accessToken)).toEqual(['version', 'sub', 'iat'])
  expect(accessToken.sub).toBe(user.uuid)
  expect(accessToken.version).toBe("1")
  expect(accessToken.iat).toBeTruthy()

  const userJSON = payload.user
  expect(Object.keys(userJSON)).toEqual(['uuid', 'created_at', 'updated_at'])
  expect(userJSON.uuid).toBe(user.uuid)
  expect(userJSON.created_at).toEqual(user.created_at.toJSON())
  expect(userJSON.updated_at).toEqual(user.updated_at.toJSON())

  done()
})

test('returns the user with the same anon_uuid', async done => {
  // Arrange
  const uuid = '87b81351-f4a2-4988-ab34-3cca91ee5dfb'
  const user = await db().users.insert({ anon_uuid: uuid })
  expect(await db().users.count()).toBe("1")

  // Act
  const req = {...request, ...{
    payload: { anon_uuid: uuid, grant_type: 'anon', client_id: constants.clientIds[0] }
  }}
  const res = await server.inject(req)
  expect(res.statusCode).toBe(200)

  // Assert
  const payload = JSON.parse(res.payload)

  // No new user was created
  expect(await db().users.count()).toBe("1")

  const accessToken = jwt.verify(payload.access_token, constants.jwtSecretKey)
  expect(Object.keys(accessToken)).toEqual(['version', 'sub', 'iat'])
  expect(accessToken.sub).toBe(user.uuid)
  expect(accessToken.version).toBe("1")
  expect(accessToken.iat).toBeTruthy()

  const userJSON = payload.user
  expect(Object.keys(userJSON)).toEqual(['uuid', 'created_at', 'updated_at'])
  expect(userJSON.uuid).toBe(user.uuid)
  expect(userJSON.created_at).toEqual(user.created_at.toJSON())
  expect(userJSON.updated_at).toEqual(user.updated_at.toJSON())

  done()
})
