import Joi from 'joi'

const config = {
  validate: {
    query: {
      updated_after: Joi.date().iso()
    }
  }
}

async function handler(request, reply) {
  const { updated_after: updatedAfter } = request.query

  return reply({ status: 'ok' })
}

export const stocks = {
  method: 'GET',
  path: '/stocks',
  handler,
  config
}

export default stocks
