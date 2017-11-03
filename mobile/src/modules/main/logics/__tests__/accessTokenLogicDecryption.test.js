import { createMockStore } from 'redux-logic-test'
import UUIDGenerator from 'react-native-uuid-generator'

import { accessTokenFetchStart } from '../../actions'
import rootReducer from '../../../../rootReducer'
import { User } from '../../../../models'
import { encrypt } from '../../../../utils/password'

import { logics } from '../sessionLogics'

import { postToken } from '../../../../utils/api'

jest.mock('../../../../utils/api', () => ({
  postToken: jest.fn(
    ({ uuid }) =>
      new Promise(resolve => {
        const json = { access_token: 'mock_access_token', user: { uuid } }
        resolve(json)
      })
  )
}))

let store = null
let user = null
let password = null

beforeEach(async () => {
  password = await UUIDGenerator.getRandomUUID()
  user = new User({ uuid: await UUIDGenerator.getRandomUUID(), password: encrypt(password) })
  store = createMockStore({ initialState: {}, reducer: rootReducer, logic: logics })

  jest.clearAllMocks()
})

it('uses a decrypted password when creating the token', async () => {
  store.dispatch(accessTokenFetchStart(user))

  return store.whenComplete(() => {
    expect(postToken).toHaveBeenCalledTimes(1)

    const parameter = postToken.mock.calls[0][0]
    expect(parameter.password).toBe(password)
  })
})
