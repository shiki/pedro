import React, { Component } from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { icons } from '../../services/icons'

import { Stock } from '../../models'

import { StockSelectionCell, MIN_HEIGHT as CELL_MIN_HEIGHT } from './components/StockSelectionCell'

import { stocksFetchStart } from '../main/actions'
import { cancelButtonPressed, stockSelected } from './actions'
import { getStocksSortedList } from './selectors'

export class StockSelection extends Component {
  static propTypes = {
    stocks: PropTypes.arrayOf(PropTypes.instanceOf(Stock)).isRequired,
    navigator: PropTypes.objectOf(Object).isRequired,
    stocksFetchStart: PropTypes.func.isRequired,
    cancelButtonPressed: PropTypes.func.isRequired,
    stockSelected: PropTypes.func.isRequired
  }

  static navigatorStyle = {
    navBarNoBorder: true
  }

  static defaultProps = {
    stocks: []
  }

  constructor(props) {
    super(props)

    this.renderItem = this.renderItem.bind(this)
    this.onCellPressed = this.onCellPressed.bind(this)

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

  onCellPressed(stock) {
    const { navigator } = this.props
    this.props.stockSelected({ navigator, stock })
  }

  renderItem({ item }) {
    return <StockSelectionCell stock={item} onPress={this.onCellPressed} />
  }

  render() {
    return (
      <FlatList
        style={styles.list}
        data={this.props.stocks}
        extraData={this.state}
        keyExtractor={keyExtractor}
        renderItem={this.renderItem}
        ItemSeparatorComponent={renderSeparator}
        getItemLayout={(data, index) => ({ offset: (CELL_MIN_HEIGHT + SEPARATOR_HEIGHT) * index, length: CELL_MIN_HEIGHT + SEPARATOR_HEIGHT, index })}
      />
    )
  }
}

const keyExtractor = item => item.symbol
const renderSeparator = () => <View style={styles.separator} />

const SEPARATOR_HEIGHT = 1

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  separator: {
    height: SEPARATOR_HEIGHT,
    backgroundColor: '#EDEDED'
  }
})

const mapStateToProps = state => ({ stocks: getStocksSortedList(state) })
const mapDispatchToProps = { stocksFetchStart, cancelButtonPressed, stockSelected }

export const StockSelectionScreen = connect(mapStateToProps, mapDispatchToProps)(StockSelection)
