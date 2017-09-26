import Hapi from 'hapi'

import DB from '../services/DB'
import constants from '../constants'
import hapiroll from './plugins/hapiroll'

import { hapiAuthStrategyConfig } from './auth'

// Create a server with a host and port
export const server = new Hapi.Server()
server.connection({ port: 8000 })

const plugins = [{ register: hapiroll, options: { accessToken: constants.ROLLBAR_ACCESS_TOKEN } }, require('hapi-auth-jwt2')]

server.register(plugins, err => {
  if (err) {
    throw err
  }
})

server.auth.strategy('jwt', 'jwt', hapiAuthStrategyConfig)
server.auth.default('jwt')

server.route(require('./routes/token').create)
server.route(require('./routes/stocks').stocks)

server.route({
  method: 'GET',
  path: '/hello',
  handler(request, reply) {
    return reply('hello world')
  },
  config: { auth: false }
})

async function start() {
  await DB.bootstrap()

  server.start(err => {
    if (err) {
      throw err
    }

    console.log('API running at:', server.info.uri)
  })
}

export default { start }

if (!module.parent) {
  start()
}
