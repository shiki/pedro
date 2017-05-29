import test from 'ava'
import server from '../server'

test('/hello', t => {
  const request = {
    method: 'GET',
    url: '/hello'
  }

  return server.inject(request)
    .then(response => {
      t.is(response.statusCode, 200, 'status code is 200')
      t.is(response.payload, 'hello world')
    })
})