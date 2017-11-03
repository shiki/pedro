import check from 'offensive'
import { stringify } from 'query-string'

import { API_BASE_URL } from '../config'

const API_CLIENT_ID = 'CLIENT_ID'

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
    console.error(error)
    throw error
  }
}

export async function getStocks({ accessToken, updatedAfter }) {
  try {
    const queryString = updatedAfter != null ? stringify({ updated_after: updatedAfter }) : ''
    const response = await fetch(`${API_BASE_URL}/stocks?${queryString}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    const json = await response.json()
    console.log('getStocks json', json)

    check(json.data.stocks, 'data.stocks').is.anArray()
    json.data.stocks.forEach(stock => {
      check(stock.symbol, 'symbol').is.aString()
      check(stock.as_of, 'as_of').is.aString()
      check(stock.updated_at, 'updated_at').is.aString()
      check(stock.name, 'name').is.aString()
      check(stock.percent_change, 'percent_change').is.aString()
      check(stock.price, 'price').is.aString()
    })

    return json.data.stocks
  } catch (error) {
    console.error(error)
    return []
  }
}
