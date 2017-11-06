import React, { Component } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { icons } from '../../services/icons'

import { Stock } from '../../models'

import Text from '../../components/Text'
import StockSelectionCell from './components/StockSelectionCell'

import { stocksFetchStart } from '../main/actions'
import { cancelButtonPressed } from './actions'

export class StockSelection extends Component {
  static propTypes = {
    stocks: PropTypes.arrayOf(PropTypes.instanceOf(Stock)).isRequired,
    navigator: PropTypes.objectOf(Object).isRequired,
    stocksFetchStart: PropTypes.func.isRequired,
    cancelButtonPressed: PropTypes.func.isRequired
  }

  static navigatorStyle = {
    navBarNoBorder: true
  }

  static defaultProps = {
    stocks: []
  }

  constructor(props) {
    super(props)

    const { navigator } = props

    navigator.setTitle({ title: 'Choose Stock' })
    navigator.setButtons({
      leftButtons: [
        {
          id: 'cancel',
          title: 'Cancel',
          testID: 'cancel',
          icon: icons.modalCancel,
          disableIconTint: true
        }
      ]
    })

    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  componentWillMount() {
    this.props.stocksFetchStart()
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'cancel') {
        const { navigator } = this.props
        this.props.cancelButtonPressed({ navigator })
      }
    }
  }

  render() {
    return (
      <FlatList
        style={styles.list}
        data={this.props.stocks}
        extraData={this.state}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
      />
    )
  }
}

const keyExtractor = item => item.symbol
const renderItem = ({ item }) => <StockSelectionCell stock={item} />
const renderSeparator = () => <View style={styles.separator} />

const styles = StyleSheet.create({
  list: {
    // backgroundColor: 'red',
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#EDEDED'
  }
})

const mapStateToProps = state => ({ stocks: state.stocks.list })
const mapDispatchToProps = { stocksFetchStart, cancelButtonPressed }

export const StockSelectionScreen = connect(mapStateToProps, mapDispatchToProps)(StockSelection)
