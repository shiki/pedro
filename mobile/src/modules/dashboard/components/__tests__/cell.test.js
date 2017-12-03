import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'

import Cell from '../Cell'
import { Stock, Alert, OPERATOR_GREATER_THAN } from '../../../../models'

it('renders correctly', () => {
  const stock = new Stock({
    symbol: 'MER',
    name: 'Meralco',
    as_of: moment(),
    price: new BigNumber(100),
    percent_change: new BigNumber(0.931),
    updated_at: moment()
  })
  const alert = new Alert({
    uuid: '__uuid__',
    user_uuid: '_user_',
    stock_symbol: stock.symbol,
    operator: OPERATOR_GREATER_THAN,
    price: new BigNumber(100.991)
  })

  const tree = renderer.create(<Cell alert={alert} stock={stock} />).toJSON()
  expect(tree).toMatchSnapshot()
})
