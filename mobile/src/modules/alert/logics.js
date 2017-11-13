import { createLogic } from 'redux-logic'
import { BigNumber } from 'bignumber.js'
import check from 'offensive'
import UUIDGenerator from 'react-native-uuid-generator'

import { User, Alert, Stock, OPERATOR_GREATER_THAN, OPERATOR_LESS_THAN } from '../../models'

import { ALERT_SAVE_START, ALERT_SAVE_REJECTED } from './types'
import { alertSaveFulfilled } from './actions'

const alertSaveLogic = createLogic({
  type: ALERT_SAVE_START,
  processOptions: {
    successType: alertSaveFulfilled,
    failType: ALERT_SAVE_REJECTED
  },

  async process({ action, getState, database }) {
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

export default [alertSaveLogic]
