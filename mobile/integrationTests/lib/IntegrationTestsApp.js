import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Navigation } from 'react-native-navigation'

import SpecRunner from './SpecRunner'

import specs from '../specs'

export default class IntegrationTestsApp extends Component {
  state = { specs }

  onTestRunnerCloseButtonPress() {
    this.setState({ activeSpec: null })
  }

  renderItem({ item: spec }) {
    console.log('renderItem', spec)
    return (
      <TouchableOpacity testID={spec.id} style={styles.row} onPress={() => this.setState({ activeSpec: spec })}>
        <Text style={styles.testName}>{spec.id}</Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    )
  }

  render() {
    if (this.state.activeSpec) {
      return <SpecRunner spec={this.state.activeSpec} onCloseButtonPress={this.onTestRunnerCloseButtonPress.bind(this)} />
    }

    return (
      <View style={styles.container}>
        <FlatList data={this.state.specs} extraData={this.state} keyExtractor={keyExtractor} renderItem={this.renderItem.bind(this)} />
      </View>
    )
  }
}

const keyExtractor = (item, index) => index

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  row: {},
  testName: {
    fontWeight: '500',
    padding: 10
  },
  separator: {
    height: 1,
    backgroundColor: '#eee'
  }
})

Navigation.registerComponent('IntegrationTestsApp', () => IntegrationTestsApp)
Navigation.startSingleScreenApp({ screen: { screen: 'IntegrationTestsApp', title: 'Integration Tests' } })
