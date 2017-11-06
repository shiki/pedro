import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { BigNumber } from 'bignumber.js'

export default class CellBorder extends PureComponent {
  static propTypes = {
    progress: PropTypes.instanceOf(BigNumber).isRequired
  }

  render() {
    const { progress } = this.props
    const width = `${progress.toNumber() * 100}%`

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
