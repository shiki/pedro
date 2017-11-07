import React, { PureComponent } from 'react'
import { TouchableHighlight, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Ionicons'

import { Stock } from '../../../models'

import Text from '../../../components/Text'

import { toDisplayFormat } from '../../../utils/number'

export class StockSelectionCell extends PureComponent {
  static propTypes = {
    stock: PropTypes.instanceOf(Stock).isRequired,
    onPress: PropTypes.func.isRequired
  }

  render() {
    const { stock, onPress } = this.props

    return (
      <TouchableHighlight underlayColor="#FAFAFA" style={styles.touchable} onPress={() => onPress(stock)}>
        <View style={styles.container}>
          <View style={styles.stockContainer}>
            <Text style={styles.stockSymbol}>
              {stock.symbol}
              <Text style={styles.stockPrice}>&nbsp;{toDisplayFormat(stock.price)}</Text>
            </Text>
            <Text style={styles.stockName}>{stock.name}</Text>
          </View>
          <Icon name="ios-arrow-forward" size={22} color="#9E9E9E" />
        </View>
      </TouchableHighlight>
    )
  }
}

export const MIN_HEIGHT = 62

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    minHeight: MIN_HEIGHT
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    paddingLeft: 17,
    paddingRight: 17
  },
  stockContainer: {
    flex: 1
  },
  stockSymbol: {
    fontSize: 20,
    color: '#555555'
  },
  stockPrice: {
    //
  },
  stockName: {
    fontSize: 12,
    color: '#BDBDBD'
  }
})
