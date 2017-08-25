import { LOAD_ALERTS_START, LOAD_ALERTS_SUCCESS } from './types'

export function loadAlerts() {
  return dispatch => {
    dispatch({ type: LOAD_ALERTS_START })

    // console.log('settimeout')
    setTimeout(() => {
      dispatch({
        type: LOAD_ALERTS_SUCCESS,
        payload: [
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
      })
    }, 1000)
    console.log('called settimeout')
  }
}
