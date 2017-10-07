import { createLogic } from 'redux-logic'
import { ADD_BUTTON_PRESSED } from './actions'

const navigationLogic = createLogic({
  type: [ADD_BUTTON_PRESSED],

  process({ action }) {
    switch (action.type) {
      case ADD_BUTTON_PRESSED: {
        const { navigator } = action.payload
        console.log('got navigation', navigator)
        navigator.showModal({
          screen: 'screen.AlertSelection',
          title: 'Hello'
        })
        break
      }
      default:
        break
    }
  }
})

export default [navigationLogic]
