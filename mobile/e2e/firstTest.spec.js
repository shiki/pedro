import specs from '../integrationTests/specs'

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

  specs.forEach(spec => {
    it(spec.name, async () => {
      const cell = element(by.id(spec.name))
      await expect(cell).toExist()
      await cell.tap()

      const successTextEl = element(by.text(FINISHED_SUCCESS_MESSAGE))
      await expect(successTextEl).toExist()

      const closeButton = element(by.id('closeButton'))
      await expect(closeButton).toBeVisible()
      await closeButton.tap()
    })
  })
})
