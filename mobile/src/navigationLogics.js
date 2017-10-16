import { createLogic } from 'redux-logic'
import { Navigation } from 'react-native-navigation'

import * as mainTypes from './modules/main/types'
import * as dashboardTypes from './modules/dashboard/types'

import * as screenIDs from './screenIDs'

const navigationLogic = createLogic({
  type: '*',

  process({ action }) {
    switch (action.type) {
      case mainTypes.ACCESS_TOKEN_FETCH_START: {
        console.log('showing nav')
        Navigation.startSingleScreenApp({
          screen: { screen: screenIDs.DASHBOARD }
        })
        break
      }
      case dashboardTypes.ADD_BUTTON_PRESSED: {
        const { navigator } = action.payload
        console.log('got navigation', navigator)
        navigator.showModal({
          screen: screenIDs.STOCK_SELECTION
        })
        break
      }
      default:
        break
    }
  }
})

export default [navigationLogic]
