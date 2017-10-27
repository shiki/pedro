import specIDs from '../specIDs'

import { FINISHED_SUCCESS_MESSAGE } from './constants'

describe('integration tests', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

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
