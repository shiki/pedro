import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import DashboardListItemBorder from './DashboardListItemBorder'
import Text from '../components/Text'

export default class DashboardListItem extends Component {
  render() {
    const { data } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.stockContainer}>
            <Text style={styles.stockSymbol}>
              {data.stock.symbol}
              <Text style={styles.stockPrice}>
                &nbsp;{data.stock.price}
              </Text>
            </Text>
            <Text style={styles.stockName}>
              {data.stock.name}
            </Text>
          </View>
          <Text style={styles.operator}>
            {data.operator}
          </Text>
          <Text style={styles.price}>
            {data.price}
          </Text>
        </View>
        <DashboardListItemBorder />
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
    fontSize: 20,
    fontFamily: 'Courier New',
    marginTop: 2,
    marginLeft: 10,
    marginRight: 10
  },
  price: {
    flex: 2.5 / 10,
    fontSize: 20,
    color: '#666666',
    textAlign: 'right'
  }
})
