import { createMockStore } from 'redux-logic-test'
import UUIDGenerator from 'react-native-uuid-generator'

import { database } from '../../../../services/db'
import { sessionLoadStart } from '../../actions'
import { SESSION_LOAD_FULFILLED } from '../../types'
import rootReducer from '../../../../rootReducer'
import { User } from '../../../../models'

import { sessionLoadUserLogic, getStoredSessionUUID, setStoredSessionUUID } from '../sessionLogics'

let store = null

beforeEach(() => {
  database.deleteAll()
  setStoredSessionUUID(null)

  store = createMockStore({ initialState: {}, reducer: rootReducer, logic: [sessionLoadUserLogic], injectedDeps: { database } })

  jest.clearAllMocks()
})

it('automatically creates a new user if there is no previously logged in', async () => {
  expect(await getStoredSessionUUID()).toBeNull()

  store.dispatch(sessionLoadStart())

  return store.whenComplete(async () => {
    const successAction = store.actions.find(action => action.type === SESSION_LOAD_FULFILLED)
    expect(successAction).toBeTruthy()
    expect(successAction.payload).toBeInstanceOf(User)

    expect(database.saveUser).toHaveBeenCalledTimes(1)
    expect(database.findUser).toHaveBeenCalledTimes(1)

    const allUsers = await database.findUsers()
    expect(allUsers).toHaveLength(1)

    const expectedUser = allUsers[0]
    expect(successAction.payload).toEqual(expectedUser)
    expect(store.getState().session.user).toEqual(expectedUser)
    expect(await getStoredSessionUUID()).toEqual(expectedUser.uuid)
  })
})

it('returns the previously logged in user if it exists', async () => {
  // Arrange
  const user = new User({ uuid: await UUIDGenerator.getRandomUUID(), password: '__pass__' })
  await database.saveUser(user)
  await setStoredSessionUUID(user.uuid)

  database.saveUser.mockClear()

  // Act
  store.dispatch(sessionLoadStart())

  // Assert
  return store.whenComplete(async () => {
    const successAction = store.actions.find(action => action.type === SESSION_LOAD_FULFILLED)
    expect(successAction).toBeTruthy()

    expect(database.saveUser).toHaveBeenCalledTimes(0)
    expect(database.findUser).toHaveBeenCalledTimes(1)

    expect(store.getState().session.user).toEqual(user)
  })
})

it('auto-creates a new user if the previously logged in uuid is invalid', async () => {
  // Arrange
  await setStoredSessionUUID('__unknown__')

  // Act
  store.dispatch(sessionLoadStart())

  // Assert
  return store.whenComplete(async () => {
    const successAction = store.actions.find(action => action.type === SESSION_LOAD_FULFILLED)
    expect(successAction).toBeTruthy()

    expect(database.saveUser).toHaveBeenCalledTimes(1)
    expect(database.findUser).toHaveBeenCalledTimes(2)

    const allUsers = await database.findUsers()
    expect(allUsers).toHaveLength(1)

    const expectedUser = allUsers[0]
    expect(store.getState().session.user).toEqual(expectedUser)
    expect(await getStoredSessionUUID()).toEqual(expectedUser.uuid)
  })
})
