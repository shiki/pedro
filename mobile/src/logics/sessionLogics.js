import { AsyncStorage } from 'react-native'
import { createLogic } from 'redux-logic'
import UUIDGenerator from 'react-native-uuid-generator'

import { SESSION_LOAD_START, SESSION_TOKEN_LOAD_START, SESSION_TOKEN_LOAD_SUCCESS } from '../actions'
import { User, toImmutable } from '../db'
import api from '../api'

import { encryptPassword, decryptPassword } from '../utils'

const sessionLoadUserLogic = createLogic({
  type: SESSION_LOAD_START,

  processOptions: {
    successType: SESSION_TOKEN_LOAD_START
  },

  async process({ realm }) {
    let user = await (async () => {
      const uuid = await AsyncStorage.getItem('session:uuid')
      return uuid !== null ? realm.objectForPrimaryKey(User.schema.name, uuid) : null
    })()

    if (user !== null) {
      return toImmutable(user)
    }

    const uuid = await UUIDGenerator.getRandomUUID()
    const password = encryptPassword(await UUIDGenerator.getRandomUUID())

    realm.write(() => {
      user = realm.create(User.schema.name, {
        uuid,
        password,
        created_at: new Date(),
        updated_at: new Date(),
        synchronized: false
      })
    })

    // Set as logged in
    await AsyncStorage.setItem('session:uuid', uuid)

    return toImmutable(user)
  }
})

const sessionLoadTokenLogic = createLogic({
  type: SESSION_TOKEN_LOAD_START,
  latest: true,

  processOptions: {
    successType: SESSION_TOKEN_LOAD_SUCCESS
  },

  async process({ getState }) {
    const token = await AsyncStorage.getItem('session:accessToken')
    if (token !== null) {
      return { token }
    }

    const currentUser = getState().session.user
    const { access_token: accessToken, user: userFromAPI } = await api.postToken({ uuid: currentUser.uuid, password: decryptPassword(currentUser.password) })
    if (!accessToken || !userFromAPI) {
      return { token }
    }

    await AsyncStorage.setItem('session:accessToken', accessToken)

    return { token: accessToken }
  }
})

export default [sessionLoadUserLogic, sessionLoadTokenLogic]
