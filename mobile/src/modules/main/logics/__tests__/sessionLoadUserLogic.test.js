import { createMockStore } from 'redux-logic-test'

import { database } from '../../../../services/db'
import { sessionLoadStart } from '../../actions'
import { SESSION_LOAD_FULFILLED } from '../../types'
import rootReducer from '../../../../rootReducer'

import { sessionLoadUserLogic, getStoredSessionUUID } from '../sessionLogics'

let store = null

beforeEach(() => {
  store = createMockStore({ initialState: {}, reducer: rootReducer, logic: [sessionLoadUserLogic], injectedDeps: { database } })
})

it('automatically creates a new user if there is no previously logged in', async () => {
  expect(await getStoredSessionUUID()).toBeNull()

  store.dispatch(sessionLoadStart())

  return store.whenComplete(async () => {
    const successAction = store.actions.find(action => action.type === SESSION_LOAD_FULFILLED)
    expect(successAction).toBeTruthy()

    expect(database.saveUser).toHaveBeenCalledTimes(1)
    expect(database.findUser).toHaveBeenCalledTimes(1)

    const allUsers = await database.findAllUsers()
    expect(allUsers).toHaveLength(1)

    const expectedUser = allUsers[0]
    expect(store.getState().session.user).toEqual(expectedUser)
    expect(await getStoredSessionUUID()).toEqual(expectedUser.uuid)
  })
})

it('returns the previously logged in user if it exists', async () => {})
