import React, { Component } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

import { addButtonPressed } from './actions'

import { icons } from '../../icons'
import Cell from './components/Cell'

class DashboardScreen extends Component {
  static navigatorStyle = {
    navBarNoBorder: true
  }

  static defaultProps = {
    data: []
  }

  static _renderItem({ item }) {
    return <Cell data={item} />
  }

  static _keyExtractor(item, index) {
    return item.uuid
  }

  constructor(props) {
    super(props)

    this.props.navigator.setButtons({
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
          icon: icons.add,
          disableIconTint: true
        }
      ]
    })

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  componentWillMount() {}

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'add') {
        const { navigator } = this.props
        this.props.addButtonPressed({ navigator })
      }
    }
  }

  render() {
    return (
      <FlatList
        style={styles.list}
        data={this.props.data}
        extraData={this.state}
        keyExtractor={DashboardScreen._keyExtractor}
        renderItem={DashboardScreen._renderItem}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  }
})

const mapStateToProps = state => ({
  data: state.alerts.list
})

export default connect(mapStateToProps, { addButtonPressed })(DashboardScreen)
