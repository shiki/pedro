import { createLogic } from 'redux-logic'
import { Navigation } from 'react-native-navigation'

import { BigNumber } from 'bignumber.js'
import moment from 'moment'

import * as mainTypes from './modules/main/types'
import * as dashboardTypes from './modules/dashboard/types'
import * as alertTypes from './modules/alert/types'

import * as screenIDs from './screenIDs'

import { Stock } from './models'

const navigationLogic = createLogic({
  type: '*',
  latest: true,

  process({ action }) {
    switch (action.type) {
      case mainTypes.ACCESS_TOKEN_FETCH_START: {
        // const stock = new Stock({
        //   symbol: 'AUB',
        //   name: 'Asia United',
        //   as_of: moment(),
        //   price: new BigNumber(123),
        //   percent_change: new BigNumber(33.33),
        //   updated_at: moment()
        // })
        Navigation.startSingleScreenApp({
          // screen: { screen: screenIDs.ALERT_CREATION },
          // passProps: { stock }
          // screen: { screen: screenIDs.NOTIFICATION_PERMISSION_REQUEST }
          screen: { screen: screenIDs.DASHBOARD }
        })
        break
      }
      case dashboardTypes.ADD_BUTTON_PRESSED: {
        const { navigator } = action.payload
        navigator.showModal({ screen: screenIDs.STOCK_SELECTION })
        break
      }
      case alertTypes.CANCEL_BUTTON_PRESSED: {
        const { navigator } = action.payload
        navigator.dismissModal()
        break
      }
      case alertTypes.STOCK_SELECTED: {
        const { navigator, stock } = action.payload
        navigator.push({ screen: screenIDs.ALERT_CREATION, passProps: { stock } })
        break
      }
      case alertTypes.BACK_BUTTON_PRESSED: {
        const { navigator } = action.payload
        navigator.pop()
        break
      }
      case alertTypes.SAVE_BUTTON_PRESSED: {
        const { navigator } = action.payload
        navigator.push({ screen: screenIDs.NOTIFICATION_PERMISSION_REQUEST })
        break
      }
      default:
        break
    }
  }
})

export default [navigationLogic]
