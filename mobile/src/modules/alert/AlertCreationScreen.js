import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { icons } from '../../services/icons'
import Text from '../../components/Text'
import { toDisplayFormat } from '../../utils/number'

import { Stock } from '../../models'

import { backButtonPressed } from './actions'

export class AlertCreation extends Component {
  static propTypes = {
    stock: PropTypes.instanceOf(Stock).isRequired,
    navigator: PropTypes.objectOf(Object).isRequired,
    backButtonPressed: PropTypes.func.isRequired
  }

  static navigatorStyle = {
    navBarNoBorder: true
  }

  constructor(props) {
    super(props)

    const { navigator } = props

    navigator.setTitle({ title: 'New Alert' })
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
    const { stock } = this.props
    console.log('stock', stock)

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container} keyboardVerticalOffset={64}>
        <Panel style={styles.stockPanel}>
          <Text style={styles.stockSymbol}>
            {stock.symbol}
            <Text style={styles.stockPrice}>&nbsp;{toDisplayFormat(stock.price)}</Text>
          </Text>
          <Text style={styles.stockName}>{stock.name}</Text>
        </Panel>
        <Panel style={styles.operatorPanel}>
          <Text style={styles.operatorLabel}>Notify me if the price</Text>
          <View style={styles.operatorButtonsContainer}>
            <OperatorButton title="rises above" />
            <OperatorButton title="falls below" selected />
          </View>
        </Panel>
        <Panel style={styles.pricePanel}>
          <Text style={styles.priceCurrency}>₱</Text>
          <TextInput style={styles.priceInput} autoFocus keyboardType="numeric" />
        </Panel>
        <View style={{ flex: 1 }} />
        <NextButton title="Next" />
      </KeyboardAvoidingView>
    )
  }
}

const Panel = ({ children, style }) => {
  const finalStyle = style ? [style, styles.panel] : styles.panel
  return <View style={finalStyle}>{children}</View>
}
Panel.propTypes = {
  children: PropTypes.arrayOf(Object).isRequired,
  style: PropTypes.number
}
Panel.defaultProps = { style: null }

const OperatorButton = ({ title, selected }) => {
  const touchableStyle = selected ? [styles.operatorButton, styles.operatorButtonSelected] : styles.operatorButton
  const textStyle = selected ? [styles.operatorButtonText, styles.operatorButtonTextSelected] : styles.operatorButtonText

  return (
    <TouchableOpacity style={touchableStyle}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  )
}
OperatorButton.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.bool
}
OperatorButton.defaultProps = { selected: false }

const NextButton = ({ title }) => (
  <TouchableOpacity style={nextButtonStyles.container}>
    <Text style={nextButtonStyles.text}>{title}</Text>
  </TouchableOpacity>
)
NextButton.propTypes = { title: PropTypes.string.isRequired }

const nextButtonStyles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: '#616161',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 17,
    color: 'white'
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  panel: {
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    paddingLeft: 20,
    paddingRight: 20
  },
  stockPanel: {
    paddingTop: 32,
    paddingBottom: 25
  },
  stockSymbol: {
    fontSize: 36,
    color: '#555555'
  },
  stockPrice: {
    fontSize: 18
  },
  stockName: {
    fontSize: 18,
    color: '#BDBDBD'
  },

  operatorPanel: {
    paddingTop: 15,
    paddingBottom: 16
  },
  operatorLabel: {
    fontSize: 12,
    minHeight: 24
  },
  operatorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  operatorButton: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  operatorButtonSelected: {
    backgroundColor: '#616161'
  },
  operatorButtonText: {
    color: '#616161'
  },
  operatorButtonTextSelected: {
    color: 'white'
  },

  pricePanel: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 16
  },
  priceCurrency: {
    fontSize: 54,
    color: '#424242'
  },
  priceInput: {
    fontSize: 54,
    color: '#424242',
    flex: 1,
    textAlign: 'right'
  }
})

const mapStateToProps = state => ({ stocks: state.stocks.list })
const mapDispatchToProps = { backButtonPressed }

export const AlertCreationScreen = connect(mapStateToProps, mapDispatchToProps)(AlertCreation)
