import specIDs from '../integrationTests/specIDs'

import { FINISHED_SUCCESS_MESSAGE } from '../integrationTests/constants'

// describe('Example', () => {
//   beforeEach(async () => {
//     await device.reloadReactNative()
//   })

//   it('should have welcome screen', async () => {
//     await element(by.id('add_alert')).tap()
//     // await expect(element(by.text('Network'))).toBeVisible()
//     // await expect(element(by.id('welcome'))).toBeVisible()
//   })

//   it('should show hello screen after tap', async () => {
//     await element(by.id('hello_button')).tap()
//     await expect(element(by.text('Hello!!!'))).toBeVisible()
//   })

//   it('should show world screen after tap', async () => {
//     await element(by.id('world_button')).tap()
//     await expect(element(by.text('World!!!'))).toBeVisible()
//   })
// })

describe('integration tests', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  // it('should have welcome screen', async () => {
  //   await element(by.id('add_alert')).tap()
  //   // await expect(element(by.text('Network'))).toBeVisible()
  //   // await expect(element(by.id('welcome'))).toBeVisible()
  // })

  specIDs.forEach(specID => {
    it(specID, async () => {
      const cell = element(by.id(specID))
      await expect(cell).toExist()
      await cell.tap()

      try {
        const successTextEl = element(by.text(FINISHED_SUCCESS_MESSAGE))
        await expect(successTextEl).toExist()
      } catch (e) {
        if (e.message.indexOf('Cannot find UI Element') >= 0) {
          throw Error('Failed')
        } else {
          throw e
        }
      }
    })
  })
})
