import { AsyncStorage } from 'react-native'
import { createLogic } from 'redux-logic'
import UUIDGenerator from 'react-native-uuid-generator'

import { SESSION_LOAD, SESSION_CHANGED } from '../actions'
import { User, toImmutable } from '../db'

import { encryptPassword } from '../utils'

const sessionLogic = createLogic({
  type: SESSION_LOAD,

  processOptions: {
    successType: SESSION_CHANGED
  },

  async process({ getState, action, realm }) {
    let user = await (async () => {
      const uuid = await AsyncStorage.getItem('session:uuid')
      return uuid !== null ? realm.objectForPrimaryKey(User.schema.name, uuid) : null
    })()

    if (user === null) {
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
    }

    return {
      user: toImmutable(user),
      jwt: await AsyncStorage.getItem('session:jwt')
    }
  }
})

export default sessionLogic
