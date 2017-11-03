// __mocks__/react-native-uuid-generator.js

import uuidv4 from 'uuid/v4'

/**
 * Mocks UUIDGenerator
 */
export default {
  getRandomUUID() {
    return new Promise(resolve => {
      resolve(uuidv4())
    })
  }
}
