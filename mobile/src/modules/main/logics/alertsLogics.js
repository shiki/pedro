import { createLogic } from 'redux-logic'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'

import { ACCESS_TOKEN_FETCH_FULFILLED, ALERTS_FETCH_START, ALERTS_FETCH_FULFILLED, ALERTS_FETCH_REJECTED } from '../types'
import { Stock } from '../../../models'

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

  async process({ action }) {
    console.log('PROCESSING', action)
    return [
      {
        uuid: 'a',
        stock: Stock.fromDB({
          symbol: 'MBT',
          name: 'Metropolitan Bank & Trust Co.',
          price: '93.67',
          percent_change: '-1.05',
          as_of: moment().toISOString(),
          updated_at: moment().toISOString()
        }),
        price: new BigNumber(103),
        operator: '>'
      },
      {
        uuid: 'b',
        stock: Stock.fromDB({
          symbol: 'ALI',
          name: 'Ayala Land Inc.',
          price: '35.19',
          percent_change: '1.55',
          as_of: moment().toISOString(),
          updated_at: moment().toISOString()
        }),
        price: new BigNumber(93),
        operator: '<'
      }
    ]
  }
})

export default [alertsFetchStartLogic, alertsFetchLogic]
