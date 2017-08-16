/**
 * From: https://gist.github.com/neilsarkar/c9b5fc7e67bbbe4c407eec17deb7311e#gistcomment-2129831
 */

import React from 'react'
import PropTypes from 'prop-types'
import { Text as BaseText, StyleSheet } from 'react-native'

const Text = ({ style, children, ...props }) => {
  let newStyle = styles.text
  if (Array.isArray(style)) {
    newStyle = [newStyle, ...style]
  } else {
    newStyle = [newStyle, style]
  }

  return (
    <BaseText {...props} style={newStyle}>
      {children}
    </BaseText>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    color: '#999999'
  }
})

Text.propTypes = {
  children: PropTypes.node.isRequired,
  style: BaseText.propTypes.style
}

Text.defaultProps = {
  style: {}
}

export default Text
