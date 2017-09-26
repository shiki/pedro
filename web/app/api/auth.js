import jwt from 'jsonwebtoken'

import DB from '../services/DB'

const JWT_ALGORITHM = 'HS256'
export const JWT_ISSUER = 'Pedro API'
const JWT_SECRET_KEY = 'JWT_SECRET_KEY'

export function generateToken(user) {
  const payload = {
    // Schema version. I think I can use this to regenerate/improve tokens later
    version: '1',
    sub: user.uuid
  }
  const options = {
    algorithm: JWT_ALGORITHM,
    issuer: JWT_ISSUER
  }
  return jwt.sign(payload, JWT_SECRET_KEY, options)
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET_KEY)
}

export const hapiAuthStrategyConfig = {
  key: JWT_SECRET_KEY,
  verifyOptions: {
    algorithms: [JWT_ALGORITHM],
    issuer: [JWT_ISSUER]
  },
  async validateFunc(decoded, request, callback) {
    // Example decoded: { version: '1', sub: 'd408871a-d5b5-4a56-b90b-f1b19017d335', iat: 1506399529, iss: 'Pedro API' }
    const user = await DB.shared.users.findOne({ uuid: decoded.sub })
    return callback(null, !!user)
  }
}
