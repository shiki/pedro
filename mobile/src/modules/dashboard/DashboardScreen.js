import React, { Component } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { icons } from '../../services/icons'
import Cell from './components/Cell'

import { Alert } from '../../models'

import { addButtonPressed } from './actions'

export class Dashboard extends Component {
  static propTypes = {
    navigator: PropTypes.objectOf(Object).isRequired,
    alerts: PropTypes.arrayOf(PropTypes.instanceOf(Alert)).isRequired,
    stocksMap: PropTypes.objectOf(Object).isRequired,
    addButtonPressed: PropTypes.func.isRequired
  }

  static navigatorStyle = {
    navBarNoBorder: true
  }

  static defaultProps = {
    alerts: []
  }

  constructor(props) {
    super(props)

    const { navigator } = this.props

    navigator.setTitle({ title: 'Pedro' })
    navigator.setButtons({
      leftButtons: [
        {
          title: 'Settings',
          icon: icons.settings,
          disableIconTint: true
        }
      ],
      rightButtons: [
        {
          id: 'add',
          title: 'Add',
          testID: 'add_alert',
          icon: icons.add,
          disableIconTint: true
        }
      ]
    })

    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))

    this.renderItem = this.renderItem.bind(this)
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        const { navigator } = this.props
        this.props.addButtonPressed({ navigator })
      }
    }
  }

  /**
   * @param {Object} param
   * @param {Alert} param.item
   */
  renderItem({ item }) {
    const { stocksMap } = this.props
    const stock = stocksMap[item.stock_symbol]
    return <Cell stock={stock} alert={item} />
  }

  render() {
    return <FlatList style={styles.list} data={this.props.alerts} extraData={this.state} keyExtractor={keyExtractor} renderItem={this.renderItem} />
  }
}

/**
 * @param {Alert} item
 */
function keyExtractor(item) {
  return item.uuid
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
})

const mapStateToProps = state => ({
  alerts: state.alerts.list,
  stocksMap: state.stocks.map
})

export const DashboardScreen = connect(mapStateToProps, { addButtonPressed })(Dashboard)
