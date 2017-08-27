import { AsyncStorage } from 'react-native'
import { createLogic } from 'redux-logic'
import UUIDGenerator from 'react-native-uuid-generator'

import { AUTH_LOAD, AUTH_USER_CHANGED } from '../actions'

const authLogic = createLogic({
  type: AUTH_LOAD,

  processOptions: {
    successType: AUTH_USER_CHANGED
  },

  async process({ getState, action, realm }) {
    console.log('PROCESSING', realm)

    const loggedInUserUUID = await AsyncStorage.getItem('loggedInUserUUID')

    let user = null
    if (loggedInUserUUID !== null) {
      user = realm.objectForPrimaryKey('User', loggedInUserUUID)
    }

    if (user === null) {
      console.log('No logged in user found. Creating a new one')

      const uuid = await UUIDGenerator.getRandomUUID()
      realm.write(() => {
        user = realm.create('User', {
          uuid,
          created_at: new Date(),
          updated_at: new Date()
        })
      })

      // Set as logged in
      await AsyncStorage.setItem('loggedInUserUUID', uuid)
    }

    console.log('Loaded user', user.uuid)
    return user
  }
})

export default authLogic
