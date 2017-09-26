import uuidv4 from 'uuid/v4'

import DB from '../../services/DB'
import { JWT_ISSUER, generateToken, verifyToken, hapiAuthStrategyConfig } from '../auth'

import fixtures from '../../tests/fixtures'

beforeEach(() => fixtures.reset())

describe('token generation', () => {
  test('generated token can be verified', () => {
    const user = { uuid: uuidv4() }
    const token = generateToken(user)
    expect(token).not.toBeNull()

    const decoded = verifyToken(token)
    expect(Object.keys(decoded).sort()).toEqual(['iat', 'iss', 'sub', 'version'])
    expect(decoded.sub).toBe(user.uuid)
    expect(decoded.iat).not.toBeNull()
    expect(decoded.iss).toBe(JWT_ISSUER)
    expect(decoded.version).not.toBeNull()
  })
})

describe('hapi strategy config validation', () => {
  const { validateFunc } = hapiAuthStrategyConfig

  it('calls callback with false if the user does not exist', async () => {
    // Arrange
    const user = { uuid: uuidv4() }
    const token = generateToken(user)
    const callback = jest.fn(() => 'dummy_result')
    const decoded = verifyToken(token)

    // Act
    const result = await validateFunc(decoded, {}, callback)

    // Assert
    expect(result).toBe('dummy_result')
    expect(callback).toHaveBeenCalledWith(null, false)
  })

  it('calls callback with true if the user exists', async () => {
    // Arrange
    const user = await DB.shared.users.insert({ uuid: uuidv4() })
    const token = generateToken(user)

    const callback = jest.fn(() => 'dummy_result')
    const decoded = verifyToken(token)

    // Act
    const result = await validateFunc(decoded, {}, callback)

    // Assert
    expect(result).toBe('dummy_result')
    expect(callback).toHaveBeenCalledWith(null, true)
  })
})
