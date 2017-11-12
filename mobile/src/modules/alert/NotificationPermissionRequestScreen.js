import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { icons } from '../../services/icons'
import Text from '../../components/Text'
import ActionButton from './components/ActionButton'

import { backButtonPressed } from './actions'

export class NotificationPermissionRequest extends Component {
  static propTypes = {
    navigator: PropTypes.objectOf(Object).isRequired,
    backButtonPressed: PropTypes.func.isRequired
  }
  static navigatorStyle = { navBarNoBorder: true }

  constructor(props) {
    super(props)

    const { navigator } = props

    navigator.setButtons({
      leftButtons: [
        {
          id: 'back',
          title: 'Back',
          testID: 'back',
          icon: icons.back,
          disableIconTint: true
        }
      ]
    })
    navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        const { navigator } = this.props
        this.props.backButtonPressed({ navigator })
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon style={styles.icon} name="notifications-none" size={111} color="#EEEEEE" />
        <Text style={styles.header}>Enable Notifications?</Text>
        <Text style={styles.content}>Pedro is all about notifications. Without your permission, we cannot notify you if stock prices rise or fall.</Text>
        <View style={styles.spacer} />
        <ActionButton title="Sure!" onPress={() => {}} />
        <ActionButton type="negative" title="I don't want to be notified" onPress={() => {}} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  icon: {
    marginTop: 85,
    alignSelf: 'center'
  },
  header: {
    fontSize: 18,
    marginTop: 27,
    color: '#616161',
    textAlign: 'center'
  },
  content: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 32
  },
  spacer: {
    flex: 1
  }
})

const mapStateToProps = state => ({})
const mapDispatchToProps = { backButtonPressed }

export const NotificationPermissionRequestScreen = connect(mapStateToProps, mapDispatchToProps)(NotificationPermissionRequest)
