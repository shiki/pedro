import { createLogic } from 'redux-logic'
import { Navigation } from 'react-native-navigation'

import * as mainTypes from './modules/main/types'
import * as dashboardTypes from './modules/dashboard/types'
import * as alertTypes from './modules/alert/types'

import * as screenIDs from './screenIDs'

const navigationLogic = createLogic({
  type: '*',
  latest: true,

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
        navigator.showModal({
          screen: screenIDs.STOCK_SELECTION
        })
        break
      }
      case alertTypes.CANCEL_BUTTON_PRESSED: {
        const { navigator } = action.payload
        navigator.dismissModal()
        break
      }
      default:
        break
    }
  }
})

export default [navigationLogic]
