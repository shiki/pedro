import React, { Component } from 'react'
import { Button, View, Text, FlatList, StyleSheet } from 'react-native'

import { FINISHED_SUCCESS_MESSAGE } from './constants'

class Runner {
  constructor({ name, fn, onInfo, onError }) {
    this.specName = name
    this.specFn = fn
    this.onInfo = onInfo
    this.onError = onError

    this.failedTestCases = []
  }

  async run() {
    const beforeEachFunctions = []
    const testCases = []

    let currentTestCaseFailures = 0

    const failedTestCases = []

    const spec = {
      it(name, fn) {
        testCases.push({ name, fn })
      },
      beforeEach(fn) {
        beforeEachFunctions.push(fn)
      }
    }

    this.specFn(spec)

    for (const testCase of testCases) {
      this.onInfo(`Testing: ${testCase.name}`)
      currentTestCaseFailures = 0

      for (const fn of beforeEachFunctions) {
        try {
          await fn()
        } catch (e) {
          currentTestCaseFailures += 1
          console.warn(e)
          this.onError(e.message)
        }
      }

      try {
        await testCase.fn()
      } catch (e) {
        currentTestCaseFailures += 1
        console.warn(e)
        this.onError(e.message)
      }

      if (currentTestCaseFailures > 0) {
        failedTestCases.push(testCase)
      }
    }

    this.failedTestCases = failedTestCases
    return failedTestCases.length === 0
  }
}

export default class SpecRunner extends Component {
  state = {
    messages: [],
    finished: false
  }

  componentDidMount() {
    const { name, fn } = this.props.spec

    const onInfo = message => {
      const messages = [...this.state.messages, { type: 'info', message }]
      this.setState({ messages })
    }
    const onError = message => {
      const messages = [...this.state.messages, { type: 'error', message }]
      this.setState({ messages })
    }

    setTimeout(async () => {
      const runner = new Runner({ name, fn, onInfo, onError })
      const failed = await runner.run()
      if (failed) {
        const messages = [...this.state.messages, { type: 'doneSuccess', message: FINISHED_SUCCESS_MESSAGE }]
        this.setState({ messages, finished: true })
      } else {
        const message = `Finished with failed tests:\n\n${runner.failedTestCases.map(t => `• ${t.name}`).join('\n')}`
        const messages = [...this.state.messages, { type: 'doneFailed', message }]
        this.setState({ messages, finished: true })
      }
    })
  }

  renderButton() {
    if (this.state.finished) {
      return (
        <View style={styles.buttonContainer}>
          <Button testID="closeButton" title="Close" onPress={this.props.onCloseButtonPress} />
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList data={this.state.messages} extraData={this.state} keyExtractor={keyExtractor} renderItem={renderItem} />
        {this.renderButton()}
      </View>
    )
  }
}

const keyExtractor = (item, index) => index
const renderItem = ({ item }) => (
  <View>
    <Text style={[styles.message, styles[item.type]]}>{item.message}</Text>
    <View style={styles.separator} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  message: {
    padding: 10
  },
  info: {},
  error: {
    color: 'red'
  },
  doneSuccess: { fontWeight: 'bold', color: 'green' },
  doneFailed: { fontWeight: 'bold', color: 'red' },
  separator: {
    height: 1,
    backgroundColor: '#eee'
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  button: {
    backgroundColor: 'blue',
    borderWidth: 1
  }
})
