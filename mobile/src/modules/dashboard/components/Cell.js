import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { BigNumber } from 'bignumber.js'

import CellBorder from './CellBorder'
import CellDetail from './CellDetail'
import Text from '../../../components/Text'

import { number as numberConfig } from '../../../config'

export default class Cell extends Component {
  render() {
    const { data } = this.props
    const { stock } = data

    // prettier-ignore
    const progress = new BigNumber(1).sub(stock.price.sub(data.price).absoluteValue().dividedBy(data.price)).toNumber()

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.stockContainer}>
            <Text style={styles.stockSymbol}>
              {stock.symbol}
              <Text style={styles.stockPrice}>&nbsp;{stock.price.toFixed(numberConfig.DECIMAL_PLACES)}</Text>
            </Text>
            <Text style={styles.stockName}>{stock.name}</Text>
          </View>
          <Text style={styles.operator}>{data.operator}</Text>
          <Text style={styles.price}>{data.price.toFixed(numberConfig.DECIMAL_PLACES)}</Text>
        </View>
        <CellDetail data={data} />
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
