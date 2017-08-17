import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default class DashboardListItemBorder extends Component {
  static defaultProps = {
    progress: 0.0
  }

  render() {
    const { progress } = this.props
    const width = `${progress * 100}%`
    return (
      <View style={styles.container}>
        <View style={styles.line} width={width} />
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
    flex: 1,
    backgroundColor: '#54C242'
  }
})
