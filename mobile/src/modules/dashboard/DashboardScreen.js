import React, { Component } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import { addButtonPressed } from './actions'

import Cell from './components/Cell'

import { icons } from '../../services/icons'

export class Dashboard extends Component {
  static navigatorStyle = {
    navBarNoBorder: true
  }

  static defaultProps = {
    data: []
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
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        const { navigator } = this.props
        this.props.addButtonPressed({ navigator })
      }
    }
  }

  render() {
    return <FlatList style={styles.list} data={this.props.data} extraData={this.state} keyExtractor={keyExtractor} renderItem={renderItem} />
  }
}

function renderItem({ item }) {
  return <Cell data={item} />
}

function keyExtractor(item, index) {
  return item.uuid
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
})

const mapStateToProps = state => ({
  data: state.alerts.list
})

export const DashboardScreen = connect(mapStateToProps, { addButtonPressed })(Dashboard)
