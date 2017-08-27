import React, { Component } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

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
          title: 'Add',
          icon: icons.add,
          disableIconTint: true
        }
      ]
    })
  }

  componentWillMount() {}

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

function mapStateToProps(state, ownProps) {
  return {
    data: state.alerts.list
  }
}

export default connect(mapStateToProps)(DashboardScreen)
