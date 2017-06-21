import Rollbar from 'rollbar'

export default function register(server, options, next) {
  const rollbar = new Rollbar({
    verbose: true,
    accessToken: options.accessToken
  })

  process.on('uncaughtException', err => {
    console.error(err)
    rollbar.error(err)
    process.exit(1)
  })

  process.on('unhandledRejection', reason => {
    console.error(reason)
    rollbar.error(reason)
  })

  server.on('request-error', (request, error) => {
    // Note: before Hapi v8.0.0, this should be 'internalError' instead of 'request-error'
    function cb(rollbarErr) {
      if (rollbarErr) {
        console.error(`Error reporting to rollbar, ignoring: ${rollbarErr}`)
      }
    }
    console.error(error)
    if (error instanceof Error) {
      return rollbar.error(error, request, cb)
    }
    return rollbar.error(`Error: ${error}`, request, cb)
  })

  server.on('log', (event, tags) => {
    if (tags.error) {
      console.error(event.data)
      return rollbar.error(event.data)
    }

    throw new Error(`Unhandled server.log: ${JSON.stringify(event)}, ${JSON.stringify(tags)}`)
  })

  server.on('request', (request, event, tags) => {
    if (tags.error) {
      console.error(event.data)
      return rollbar.error(event.data, request)
    }

    throw new Error(`Unhandled server.log: ${JSON.stringify(event)}, ${JSON.stringify(tags)}`)
  })

  next()
}

register.attributes = {
  name: 'hapiroll',
  version: '0.0.1'
}
