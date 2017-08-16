import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default class DashboardListItemBorder extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.line} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 1,
    backgroundColor: '#EDEDED'
  },
  line: {
    width: '20%',
    flex: 1,
    backgroundColor: '#54C242'
  }
})
