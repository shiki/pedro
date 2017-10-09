import React, { Component } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import Text from '../../components/Text'

import { stocksFetchStart } from '../main/actions'

export class StockSelection extends Component {
  static navigatorStyle = {
    navBarNoBorder: true
  }

  static defaultProps = {
    stocks: []
  }

  componentWillMount() {
    this.props.stocksFetchStart()
  }

  render() {
    return <FlatList style={styles.list} data={this.props.stocks} extraData={this.state} keyExtractor={keyExtractor} renderItem={renderItem} />
  }
}

function keyExtractor(item, index) {
  return item.symbol
}

function renderItem({ item }) {
  return <Text>{item.symbol}</Text>
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'red',
    flex: 1
  }
})

const mapStateToProps = () => ({})

export const StockSelectionScreen = connect(mapStateToProps, { stocksFetchStart })(StockSelection)
