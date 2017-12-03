import { createLogic } from 'redux-logic'
import { BigNumber } from 'bignumber.js'
import UUIDGenerator from 'react-native-uuid-generator'
import check from 'offensive'

import { database } from '../../../services/db'

import {
  ACCESS_TOKEN_FETCH_FULFILLED,
  ALERTS_FETCH_START,
  ALERTS_FETCH_FULFILLED,
  ALERTS_FETCH_REJECTED,
  ALERTS_SAVE_START,
  ALERTS_SAVE_REJECTED
} from '../types'
import { alertsSaveFulfilled } from '../actions'
import { Alert, User, Stock, OPERATOR_GREATER_THAN, OPERATOR_LESS_THAN } from '../../../models'

const alertsFetchStartLogic = createLogic({
  type: ACCESS_TOKEN_FETCH_FULFILLED,
  processOptions: {
    successType: ALERTS_FETCH_START
  },
  process() {
    return null
  }
})

const alertsFetchLogic = createLogic({
  type: ALERTS_FETCH_START,

  processOptions: {
    successType: ALERTS_FETCH_FULFILLED,
    failType: ALERTS_FETCH_REJECTED
  },

  // TODO synchronize
  async process({ getState }) {
    const user = getState().session.user
    return database.findAlerts(user.uuid)
  }
})

const alertsSaveLogic = createLogic({
  type: ALERTS_SAVE_START,
  processOptions: {
    successType: alertsSaveFulfilled,
    failType: ALERTS_SAVE_REJECTED
  },

  async process({ action, getState }) {
    const { navigator, stock, operator, price: priceAsString } = action.payload
    const user = getState().session.user

    check(user, 'user').is.anInstanceOf(User)
    check(stock, 'stock').is.anInstanceOf(Stock)
    check(operator, 'operator').is.oneOf([OPERATOR_GREATER_THAN, OPERATOR_LESS_THAN])
    check(priceAsString, 'price').is.aString()

    const price = new BigNumber(priceAsString)
    const alert = new Alert({
      uuid: await UUIDGenerator.getRandomUUID(),
      user_uuid: user.uuid,
      stock_symbol: stock.symbol,
      operator,
      price
    })

    await database.saveAlert(alert)

    return { navigator, alert }
  }
})

export default [alertsFetchStartLogic, alertsFetchLogic, alertsSaveLogic]
