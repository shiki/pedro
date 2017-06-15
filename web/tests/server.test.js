import { server } from '../server'

test('/hello', done => {
  const request = {
    method: 'GET',
    url: '/hello'
  }

  return server.inject(request).then(response => {
    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('hello world')
    done()
  })
})
