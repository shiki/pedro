import React, { Component } from 'react'
import { ListView, StyleSheet, Text } from 'react-native'

export default class Dashboard extends Component {
  constructor() {
    super()

    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      dataSource: dataSource.cloneWithRows(['row 1', 'row 2'])
    }
  }

  static renderRow(row) {
    console.log('row', row)
    return (
      <Text>
        {row}
      </Text>
    )
  }

  render() {
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
