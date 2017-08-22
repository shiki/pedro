import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Text from '../../../components/Text'

export default class CellDetail extends Component {
  render() {
    const { data } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.stockContainer}>
          <Text style={styles.labelText}>Last price</Text>
          <Text style={styles.valueText}>
            {data.stock.price}
          </Text>
          <Text style={[styles.labelText, styles.changeLabel]}>Change</Text>
          <Text style={[styles.changeValuesNegative, styles.valueText]}>
            -32.00
            <Text>{'\n'}</Text>
            -0.87%
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoContentContainer}>
            <Text style={styles.messageText}>
              The price went above 1,377.81 yesterday, 3:25 PM.
            </Text>
            <View style={styles.resetContainer}>
              <Icon name="error-outline" style={styles.warningIcon} />
              <Text style={styles.resetMessage}>
                Reset or change the target price to be notified again.
              </Text>
            </View>
          </View>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity onPress={() => console.log('pressed')}>
              <Icon name="refresh" style={styles.actionButtonIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="create" style={styles.actionButtonIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="delete" style={styles.actionButtonIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    flex: 1,
    flexDirection: 'row'
  },
  stockContainer: {
    backgroundColor: '#F5F5F5',
    alignItems: 'flex-end',
    width: 78,
    padding: 11
  },
  changeLabel: {
    marginTop: 11
  },
  changeValuesNegative: {
    color: '#E57373'
  },
  labelText: {
    fontSize: 10,
    textAlign: 'right'
  },
  valueText: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between'
  },
  infoContentContainer: {
    padding: 11
  },
  messageText: {
    fontSize: 12
  },
  resetContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  resetMessage: {
    fontSize: 10,
    marginLeft: 4,
    color: '#BDBDBD'
  },
  warningIcon: {
    color: '#BDBDBD',
    fontSize: 18
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  actionButtonIcon: {
    width: 36,
    height: 36,
    fontSize: 20,
    lineHeight: 36,
    textAlign: 'center',
    color: '#757575'
  }
})
