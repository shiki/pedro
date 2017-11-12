import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import Text from '../../../components/Text'

const TYPE_DEFAULT = 'default'
const TYPE_NEGATIVE = 'negative'

export default class ActionButton extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    type: PropTypes.oneOf([TYPE_DEFAULT, TYPE_NEGATIVE]).isRequired
  }

  static defaultProps = {
    type: TYPE_DEFAULT
  }

  render() {
    const { title, type, onPress } = this.props

    const containerStyle = type === TYPE_NEGATIVE ? [styles.container, styles.containerNegative] : styles.container
    const textStyle = type === TYPE_NEGATIVE ? [styles.text, styles.textNegative] : styles.text

    return (
      <TouchableOpacity style={containerStyle} onPress={onPress}>
        <Text style={textStyle}>{title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: '#616161',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 17,
    color: 'white'
  },

  containerNegative: {
    backgroundColor: 'transparent'
  },
  textNegative: {
    fontSize: 13,
    color: '#9E9E9E'
  }
})
