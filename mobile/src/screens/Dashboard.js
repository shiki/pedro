import React, { Component } from 'react'
import { ListView, StyleSheet, Text } from 'react-native'
import { icons } from '../icons'

export default class Dashboard extends Component {
  static navigatorButtons = {}
  static renderRow(row) {
    console.log('row', row)
    return (
      <Text>
        {row}
      </Text>
    )
  }

  constructor() {
    super()

    // console.log('this.props.navigator', this.props.navigator)

    // this.props.navigator.setButtons({
    //   leftButtons: [
    //     {
    //       title: 'Settings'
    //     }
    //   ]
    // })

    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      dataSource: dataSource.cloneWithRows(['row 1', 'row 2'])
    }
  }

  componentWillMount() {
    console.log('componentWillMount', this.props.navigator)
    this.props.navigator.setButtons({
      leftButtons: [
        {
          title: 'Settings',
          icon: icons.settings,
          disableIconTint: true
        }
      ]
    })
  }

  render() {
    console.log('this.props.navigator', this.props.navigator)
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={Dashboard.renderRow}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
})
