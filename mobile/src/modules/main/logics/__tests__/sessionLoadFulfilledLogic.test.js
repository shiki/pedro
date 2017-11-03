import { createMockStore } from 'redux-logic-test'

import rootReducer from '../../../../rootReducer'
import { sessionLoadFulfilled } from '../../actions'
import { ACCESS_TOKEN_FETCH_START } from '../../types'
import { User } from '../../../../models'

import { sessionLoadFulfilledLogic } from '../sessionLogics'

let store = null
let user = null

beforeEach(async () => {
  user = new User({ uuid: '__uuid__', password: '__pass__' })
  store = createMockStore({ initialState: {}, reducer: rootReducer, logic: [sessionLoadFulfilledLogic] })

  jest.clearAllMocks()
})

it('immediately dispatches a different action', async () => {
  store.dispatch(sessionLoadFulfilled(user))

  return store.whenComplete(() => {
    const action = store.actions[store.actions.length - 1]
    expect(action).toBeTruthy()
    expect(action.type).toEqual(ACCESS_TOKEN_FETCH_START)
    expect(action.payload).toEqual(user)
  })
})
