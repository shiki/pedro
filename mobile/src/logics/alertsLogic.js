import { createLogic } from 'redux-logic'

import { SESSION_CHANGED, ALERTS_LOAD_SUCCESS } from '../actions'

const alertsLogic = createLogic({
  type: SESSION_CHANGED,

  processOptions: {
    successType: ALERTS_LOAD_SUCCESS
  },

  async process({ getState, action, realm }) {
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

export default alertsLogic
