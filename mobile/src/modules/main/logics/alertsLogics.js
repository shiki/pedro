import { createLogic } from 'redux-logic'

import { ACCESS_TOKEN_FETCH_FULFILLED, ALERTS_FETCH_START, ALERTS_FETCH_FULFILLED, ALERTS_FETCH_REJECTED } from '../types'

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
        stock: {
          symbol: 'MBT',
          price: 93.67,
          name: 'Metropolitan Bank & Trust Co.'
        },
        price: 103,
        operator: '>'
      },
      {
        uuid: 'b',
        stock: {
          symbol: 'ALI',
          price: 35.19,
          name: 'Ayala Land Inc.'
        },
        price: 32.61,
        operator: '<'
      },
      {
        uuid: 'c',
        stock: {
          symbol: 'MER',
          price: 13610.29,
          name: 'Lorem ipsum dolor sit amet yada yada lorem ipsum ah nee yoh'
        },
        price: 93632.97,
        operator: '<'
      }
    ]
  }
})

export default [alertsFetchStartLogic, alertsFetchLogic]
