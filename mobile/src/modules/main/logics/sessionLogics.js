import { AsyncStorage } from 'react-native'
import { createLogic } from 'redux-logic'
import UUIDGenerator from 'react-native-uuid-generator'

import * as api from '../../../utils/api'
import { encrypt, decrypt } from '../../../utils/password'
import { User } from '../../../models'

import * as types from '../types'
import { sessionLoadFulfilled, accessTokenFetchStart, accessTokenFetchFulfilled } from '../actions'

export const sessionLoadUserLogic = createLogic({
  type: types.SESSION_LOAD_START,

  processOptions: {
    successType: sessionLoadFulfilled
  },

  async process({ database }) {
    let user = await (async () => {
      const uuid = await getStoredSessionUUID()
      return uuid !== null ? database.findUser({ uuid }) : null
    })()

    if (user !== null) {
      return user
    }

    const uuid = await UUIDGenerator.getRandomUUID()
    const password = encrypt(await UUIDGenerator.getRandomUUID())

    await database.saveUser(new User({ uuid, password }))
    user = await database.findUser({ uuid })

    // Set as logged in
    await setStoredSessionUUID(uuid)

    return user
  }
})

export const sessionLoadFulfilledLogic = createLogic({
  type: types.SESSION_LOAD_FULFILLED,
  processOptions: {
    successType: accessTokenFetchStart
  },
  process({ action }) {
    return action.payload
  }
})

const accessTokenLoadLogic = createLogic({
  type: types.ACCESS_TOKEN_FETCH_START,
  latest: true,

  processOptions: {
    successType: accessTokenFetchFulfilled,
    failType: types.ACCESS_TOKEN_FETCH_REJECTED
  },

  async process({ action }) {
    const user = action.payload

    let accessToken = await getStoredAccessToken(user.uuid)
    if (accessToken !== null) {
      return accessToken
    }

    const result = await api.postToken({ uuid: user.uuid, password: decrypt(user.password) })

    accessToken = result.access_token
    await setStoredAccessToken(user.uuid, accessToken)
    return accessToken
  }
})

export async function getStoredSessionUUID() {
  return (await AsyncStorage.getItem('session:uuid')) || null
}

export async function setStoredSessionUUID(uuid) {
  return AsyncStorage.setItem('session:uuid', uuid)
}

export async function setStoredAccessToken(userUUID, accessToken) {
  const key = `session:accessToken:${userUUID}`
  return AsyncStorage.setItem(key, accessToken)
}

export async function getStoredAccessToken(userUUID) {
  const key = `session:accessToken:${userUUID}`
  return (await AsyncStorage.getItem(key)) || null
}

export const logics = [sessionLoadUserLogic, sessionLoadFulfilledLogic, accessTokenLoadLogic]
