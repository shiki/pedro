'use strict';

const Hapi = require('hapi')
// const db = require('./services/db')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
})

server.route({
  method: 'POST',
  path: '/token',
  handler: (request, reply) => {

  }
})

// Add the route
server.route({
  method: 'GET',
  path: '/hello',
  handler: function (request, reply) {
    return reply('hello world')
    // const obj = [{
    //   ti: 'tia',
    //   ref: 'lkjdfljdslf'
    // }]
    // return reply(obj)
    // return reply('hello world');
  }
})

// Start the server
if (!module.parent) {
  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
}

module.exports = server;