import Joi from 'joi'
import Boom from 'boom'
import constants from '../constants'
import { shared as db } from '../services/db'
import jwt from 'jsonwebtoken'
import check from 'offensive'
import mask from 'json-mask'

const config = {
  validate: {
    payload: {
      anon_uuid: Joi.string().uuid({ version: ['uuidv4'] }).required().error(new Error('Missing or invalid uuid')),
      grant_type: Joi.string().valid('anon').required().error(new Error('Invalid grant_type')),
      client_id: Joi.string().required()
    }
  }
}

async function handler(request, reply) {
  const {
    anon_uuid: anonUUID,
    client_id: clientId
  } = request.payload

  if (constants.clientIds.indexOf(clientId) < 0) {
    return reply(Boom.unauthorized('Invalid client_id'))
  }

  let user = null

  try {
    const users = await db().users.find({anon_uuid: anonUUID})
    if (users.length > 0) {
      check(users.length, 'users.length').is.exactly(1)
      user = users[0]
    } else {
      user = await db().users.insert({anon_uuid: anonUUID})
    }
  } catch (e) {
    console.error(e)
    return reply(Boom.badImplementation())
  }

  const token = generateToken(user)
  const response = {
    access_token: token,
    user: mask(user, 'uuid,created_at,updated_at')
  }
  reply(response)
}

function generateToken(user) {
  const payload = {
    // Schema version. I think I can use this to regenerate/improve tokens later
    version: "1",
    sub: user.uuid
  }
  return jwt.sign(payload, constants.jwtSecretKey)
}

export const create = {
  method: 'POST',
  path: '/token',
  handler: handler,
  config: config
}