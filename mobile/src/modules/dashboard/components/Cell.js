import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { BigNumber } from 'bignumber.js'

import CellBorder from './CellBorder'
import CellDetail from './CellDetail'
import Text from '../../../components/Text'
import { Stock, Alert } from '../../../models'

import { toDisplayFormat } from '../../../utils/number'

export default class Cell extends PureComponent {
  static propTypes = {
    stock: PropTypes.instanceOf(Stock).isRequired,
    alert: PropTypes.instanceOf(Alert).isRequired
  }

  render() {
    const { stock, alert } = this.props

    const progress = new BigNumber(1).sub(
      stock.price
        .sub(alert.price)
        .absoluteValue()
        .dividedBy(alert.price)
    )

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.stockContainer}>
            <Text style={styles.stockSymbol}>
              {stock.symbol}
              <Text style={styles.stockPrice}>&nbsp;{toDisplayFormat(stock.price)}</Text>
            </Text>
            <Text style={styles.stockName}>{stock.name}</Text>
          </View>
          <Text style={styles.operator}>{alert.operator}</Text>
          <Text numberOfLines={1} style={styles.price}>
            {toDisplayFormat(alert.price)}
          </Text>
        </View>
        <CellDetail stock={stock} />
        <CellBorder progress={progress} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 76,
    alignItems: 'stretch'
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11
  },
  stockContainer: {
    flex: 6 / 10
  },
  stockSymbol: {
    fontSize: 20,
    color: '#555555'
  },
  stockPrice: {
    //
  },
  stockName: {
    fontSize: 10,
    color: '#BDBDBD'
  },
  operator: {
    flex: 1 / 10,
    fontSize: 20,
    fontFamily: 'Courier New',
    marginTop: 2,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'right'
  },
  price: {
    flex: 3 / 10,
    fontSize: 20,
    color: '#666666',
    textAlign: 'right'
  }
})
