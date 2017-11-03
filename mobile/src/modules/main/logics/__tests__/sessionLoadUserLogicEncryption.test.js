import { createMockStore } from 'redux-logic-test'

import { database } from '../../../../services/db'
import { sessionLoadStart } from '../../actions'
import { SESSION_LOAD_FULFILLED } from '../../types'
import rootReducer from '../../../../rootReducer'

import { sessionLoadUserLogic } from '../sessionLogics'

import { encrypt } from '../../../../utils/password'

jest.mock('../../../../utils/password', () => ({
  encrypt: jest.fn(string => `__encrypted__:${string}`)
}))

let store = null

beforeEach(() => {
  database.deleteAll()

  store = createMockStore({ initialState: {}, reducer: rootReducer, logic: [sessionLoadUserLogic], injectedDeps: { database } })

  jest.clearAllMocks()
})

it('encrypts the password when saving to the database', async () => {
  store.dispatch(sessionLoadStart())

  return store.whenComplete(async () => {
    const successAction = store.actions.find(action => action.type === SESSION_LOAD_FULFILLED)
    expect(successAction).toBeTruthy()

    expect(encrypt).toHaveBeenCalledTimes(1)

    const allUsers = await database.findAllUsers()
    const user = allUsers[0]

    expect(user.password).toContain('__encrypted__')
  })
})
