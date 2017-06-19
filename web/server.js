import Hapi from 'hapi'

import * as db from './services/db'
import constants from './constants'
import hapiroll from './plugins/hapiroll'

// Create a server with a host and port
export const server = new Hapi.Server()
server.connection({ host: 'localhost', port: 8000 })
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

export async function start() {
  await db.bootstrap()
  server.start(err => {
    if (err) {
      throw err
    }

    console.log('Server running at:', server.info.uri)
  })
}

// Start the server
if (!module.parent) {
  start()
}
