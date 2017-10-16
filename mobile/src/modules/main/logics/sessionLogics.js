import { AsyncStorage } from 'react-native'
import { createLogic } from 'redux-logic'
import UUIDGenerator from 'react-native-uuid-generator'

import * as api from '../../../utils/api'
import { encrypt, decrypt } from '../../../utils/password'

import * as types from '../types'

const sessionLoadUserLogic = createLogic({
  type: types.SESSION_LOAD_START,

  processOptions: {
    successType: types.SESSION_LOAD_FULFILLED
  },

  async process({ database }) {
    let user = await (async () => {
      const uuid = await AsyncStorage.getItem('session:uuid')
      return uuid !== null ? database.findUser({ uuid }) : null
    })()

    if (user !== null) {
      return user
    }

    const uuid = await UUIDGenerator.getRandomUUID()
    const password = encrypt(await UUIDGenerator.getRandomUUID())

    await database.saveUser({ uuid, password })
    user = await database.findUser({ uuid })

    // Set as logged in
    await AsyncStorage.setItem('session:uuid', uuid)

    return user
  }
})

const sessionLoadFulfilledLogic = createLogic({
  type: types.SESSION_LOAD_FULFILLED,
  processOptions: {
    successType: types.ACCESS_TOKEN_FETCH_START
  },
  process() {
    return null
  }
})

const accessTokenLoadLogic = createLogic({
  type: types.ACCESS_TOKEN_FETCH_START,
  latest: true,

  processOptions: {
    successType: types.ACCESS_TOKEN_FETCH_FULFILLED,
    failType: types.ACCESS_TOKEN_FETCH_REJECTED
  },

  async process({ getState }) {
    let accessToken = await AsyncStorage.getItem('session:accessToken')
    if (accessToken !== null) {
      return { accessToken }
    }

    const currentUser = getState().session.user
    const result = await api.postToken({ uuid: currentUser.uuid, password: decrypt(currentUser.password) })

    accessToken = result.access_token
    await AsyncStorage.setItem('session:accessToken', accessToken)
    return { accessToken }
  }
})

export default [sessionLoadUserLogic, sessionLoadFulfilledLogic, accessTokenLoadLogic]
