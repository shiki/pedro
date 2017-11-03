import { createMockStore } from 'redux-logic-test'
import UUIDGenerator from 'react-native-uuid-generator'

import { accessTokenFetchStart } from '../../actions'
import { ACCESS_TOKEN_FETCH_FULFILLED, ACCESS_TOKEN_FETCH_REJECTED } from '../../types'
import rootReducer from '../../../../rootReducer'
import { User } from '../../../../models'
import { encrypt } from '../../../../utils/password'

import { logics, getStoredAccessToken } from '../sessionLogics'

let store = null
let user = null

beforeEach(async () => {
  user = new User({ uuid: await UUIDGenerator.getRandomUUID(), password: encrypt(await UUIDGenerator.getRandomUUID()) })
  store = createMockStore({ initialState: {}, reducer: rootReducer, logic: logics })

  jest.clearAllMocks()
})

it('fetches a token from the api if there is no token', async () => {
  expect(await getStoredAccessToken(user.uuid)).toBeNull()

  store.dispatch(accessTokenFetchStart(user))

  return store.whenComplete(async () => {
    const action = store.actions[store.actions.length - 1]
    expect(action.type).toEqual(ACCESS_TOKEN_FETCH_FULFILLED)
    expect(action.payload).toBeTruthy()
    expect(typeof action.payload).toBe('string')

    const storedAccessToken = await getStoredAccessToken(user.uuid)
    expect(storedAccessToken).not.toBeNull()
    expect(storedAccessToken).toEqual(action.payload)
  })
})

it('uses the stored token if it already exists', async () => {})
