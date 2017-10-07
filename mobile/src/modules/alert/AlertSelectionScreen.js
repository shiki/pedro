import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

class AlertSelectionScreen extends Component {
  render() {
    return <View style={styles.view} />
  }
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'red',
    flex: 1
  }
})

const mapStateToProps = () => ({})

export default connect(mapStateToProps)(AlertSelectionScreen)
