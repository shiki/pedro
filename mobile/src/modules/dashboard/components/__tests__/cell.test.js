import 'react-native'
import React from 'react'

import renderer from 'react-test-renderer'

import moment from 'moment'
import { BigNumber } from 'bignumber.js'

import Cell from '../Cell'
// import Stock from '../../../../src/services/db/Stock'

it('renders correctly', () => {
  const data = {
    stock: { symbol: 'MER', name: 'Meralco', as_of: moment(), price: new BigNumber(100), percent_change: new BigNumber(0.931), updated_at: moment() },
    operator: '>',
    price: new BigNumber(100.991)
  }
  const tree = renderer.create(<Cell data={data} />).toJSON()
  expect(tree).toMatchSnapshot()
})
