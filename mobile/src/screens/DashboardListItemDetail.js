import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '../components/Text'

export default class DashboardListItemDetail extends Component {
  render() {
    const { data } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.stockContainer}>
          <Text style={styles.labelText}>Last price</Text>
          <Text style={styles.valueText}>
            {data.stock.price}
          </Text>
          <Text style={[styles.labelText, styles.changeLabel]}>Change</Text>
          <Text style={[styles.changeValuesNegative, styles.valueText]}>
            -32.00
            <Text>{'\n'}</Text>
            -0.87%
          </Text>
        </View>
        <View style={styles.infoContainer} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    flex: 1,
    flexDirection: 'row'
  },
  stockContainer: {
    backgroundColor: '#F5F5F5',
    alignItems: 'flex-end',
    width: 78,
    paddingTop: 11,
    paddingBottom: 11,
    paddingRight: 11,
    paddingLeft: 11
  },
  changeLabel: {
    marginTop: 11
  },
  changeValuesNegative: {
    color: '#E57373'
  },
  labelText: {
    fontSize: 10,
    textAlign: 'right'
  },
  valueText: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  }
})
