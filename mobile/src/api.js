import check from 'offensive'

import { apiBaseURL, apiClientId } from './constants'

async function postToken({ uuid, password }) {
  console.log('password', password)
  try {
    const response = await fetch(`${apiBaseURL}/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uuid,
        password,
        client_id: apiClientId,
        grant_type: 'anon'
      })
    })
    const json = await response.json()
    console.log('json', json)
    check(json.access_token, 'access_token').is.aString()
    check(json.user, 'user').is.anObject()
    return json
  } catch (error) {
    console.error(error)
    return null
  }
}

export default { postToken }
