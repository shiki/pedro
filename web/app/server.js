import Hapi from 'hapi'
import cluster from 'cluster'

import DB from './services/DB'
import constants from './constants'
import hapiroll from './plugins/hapiroll'

import { startGathering } from './gatherer/gatherer'

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

export async function start() {
  await DB.bootstrap()
  server.start(err => {
    if (err) {
      throw err
    }

    console.log('Server running at:', server.info.uri)
  })
}

// Start the server
if (!module.parent) {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)
    cluster.fork({ PEDRO_FORK_TYPE: 'webserver' })
    cluster.fork({ PEDRO_FORK_TYPE: 'gatherer' })
  } else {
    const forkType = process.env.PEDRO_FORK_TYPE
    console.log(`Worker ${process.pid} started: ${forkType}`)
    if (forkType === 'gatherer') {
      startGathering()
    } else {
      start()
    }
  }
}
