import Joi from 'joi'
import Boom from 'boom'
import jwt from 'jsonwebtoken'
import check from 'offensive'
import mask from 'json-mask'
import argon2 from 'argon2'

import constants from '../constants'
import DB from '../services/DB'

const config = {
  validate: {
    payload: {
      uuid: Joi.string()
        .uuid({ version: ['uuidv4'] })
        .required()
        .error(new Error('Missing or invalid uuid')),
      password: Joi.string().required().max(128).error(new Error('Missing or invalid password')),
      grant_type: Joi.string().valid('anon').required().error(new Error('Invalid grant_type')),
      client_id: Joi.string().required()
    }
  }
}

async function handler(request, reply) {
  const { uuid, password, client_id: clientId } = request.payload

  if (constants.clientIds.indexOf(clientId) < 0) {
    return reply(Boom.unauthorized('Invalid client_id'))
  }

  let user = null

  try {
    const users = await DB.shared.users.find({ uuid })
    if (users.length > 0) {
      check(users.length, 'users.length').is.exactly(1)
      user = users[0]

      const validPassword = await verifyPassword(user.password, password)
      if (!validPassword) {
        return reply(Boom.unauthorized('Invalid credentials'))
      }
    } else {
      const hash = await protectPassword(password)
      user = await DB.shared.users.insert({ uuid, password: hash })
    }
  } catch (e) {
    request.log('error', e)
    return reply(Boom.badImplementation())
  }

  const token = generateToken(user)
  const response = {
    access_token: token,
    user: mask(user, 'uuid,created_at,updated_at')
  }

  return reply(response)
}

function generateToken(user) {
  const payload = {
    // Schema version. I think I can use this to regenerate/improve tokens later
    version: '1',
    sub: user.uuid
  }
  return jwt.sign(payload, constants.jwtSecretKey)
}

/**
 * Generates a hash of the password. The salt is already included in the result.
 * 
 * @see https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba
 * @see https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
 * 
 * @param {string} password 
 * @returns Promise<string>
 */
export function protectPassword(password) {
  return argon2.hash(password)
}

/**
 * 
 * @param {string} hash 
 * @param {string} password 
 * @returns Promise<boolean>
 */
export function verifyPassword(hash, password) {
  return argon2.verify(hash, password)
}

export const create = {
  method: 'POST',
  path: '/token',
  handler,
  config
}
