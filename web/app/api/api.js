import Hapi from 'hapi'

import DB from '../services/DB'
import constants from '../constants'
import hapiroll from './plugins/hapiroll'

// Create a server with a host and port
export const server = new Hapi.Server()
server.connection({ port: 8000 })
server.route(require('./routes/token').create)

// Add the route
server.route({
  method: 'GET',
  path: '/hello',
  handler(request, reply) {
    return reply('hello world')
  }
})

server.register(
  {
    register: hapiroll,
    options: { accessToken: constants.rollbarAccessToken }
  },
  err => {
    if (err) {
      throw err
    }
  }
)

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
