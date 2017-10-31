// __mocks__/react-native-uuid-generator.js

/**
 * Mocks UUIDGenerator
 */
export default {
  getRandomUUID() {
    return new Promise(resolve => {
      // https://stackoverflow.com/a/18120932/246142
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const stringLength = 5

      function pickRandom() {
        return possible[Math.floor(Math.random() * possible.length)]
      }

      const randomString = Array(...Array(stringLength))
        .map(pickRandom)
        .join('')

      resolve(randomString)
    })
  }
}
