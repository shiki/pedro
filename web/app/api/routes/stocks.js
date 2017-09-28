import Joi from 'joi'
import mask from 'json-mask'

import DB from '../../services/DB'

const config = {
  validate: {
    query: {
      updated_after: Joi.date().iso()
    }
  }
}

async function handler(request, reply) {
  const { updated_after: updatedAfter } = request.query
  const criteria = updatedAfter ? { 'updated_at >': updatedAfter } : {}
  const stocks = await DB.shared.stocks.find(criteria)
  const response = {
    data: {
      stocks: mask(stocks, 'symbol,as_of,price,percent_change,updated_at,name')
    }
  }
  return reply(response)
}

export const stocks = {
  method: 'GET',
  path: '/stocks',
  handler,
  config
}

export default stocks
