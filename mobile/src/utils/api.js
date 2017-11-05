/* global fetch */

import check from 'offensive'
import { stringify } from 'query-string'

import { API_BASE_URL } from '../config'

const API_CLIENT_ID = 'CLIENT_ID'

/**
 * @returns {{user: Object, access_token: string}}
 */
export async function postToken({ uuid, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid,
        password,
        client_id: API_CLIENT_ID,
        grant_type: 'anon'
      })
    })

    const json = await response.json()
    check(json.access_token, 'access_token').is.aString()
    check(json.user, 'user').is.anObject()

    return json
  } catch (error) {
    throw error
  }
}

/**
 * @param {Object} param
 * @param {string} param.accessToken
 * @param {moment} param.updatedAfter
 */
export async function getStocks({ accessToken, updatedAfter }) {
  const queryString = updatedAfter ? stringify({ updated_after: updatedAfter.toISOString() }) : ''
  const response = await fetch(`${API_BASE_URL}/stocks?${queryString}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })

  const json = await response.json()

  check(json.data, 'json.data').is.anObject()
  check(json.data.stocks, 'json.data.stocks').is.anArray()
  json.data.stocks.forEach(stock => {
    check(stock.symbol, 'stock.symbol').is.aString()
    check(stock.as_of, 'stock.as_of').is.aString()
    check(stock.updated_at, 'stock.updated_at').is.aString()
    check(stock.name, 'stock.name').is.aString()
    check(stock.percent_change, 'stock.percent_change').is.aString()
    check(stock.price, 'stock.price').is.aString()
  })

  return json.data.stocks
}
