import React, { Component } from 'react'
import { View, FlatList, StyleSheet, Text } from 'react-native'
import { icons } from '../icons'

import DashboardListItem from './DashboardListItem'

export default class Dashboard extends Component {
  static navigatorStyle = {
    navBarNoBorder: true
  }

  static defaultProps = {
    data: [
      {
        uuid: 'a',
        stock: {
          symbol: 'MBT',
          price: 93.67,
          name: 'Metropolitan Bank & Trust Co.'
        },
        price: 103,
        operator: '>'
      },
      {
        uuid: 'b',
        stock: {
          symbol: 'ALI',
          price: 35.19,
          name: 'Ayala Land Inc.'
        },
        price: 32.61,
        operator: '<'
      },
      {
        uuid: 'c',
        stock: {
          symbol: 'MER',
          price: 13610.29,
          name: 'Lorem ipsum dolor sit amet yada yada lorem ipsum ah nee yoh'
        },
        price: 93632.97,
        operator: '<'
      }
    ]
  }

  static _renderItem({ item }) {
    return <DashboardListItem data={item} />
  }

  static _keyExtractor(item, index) {
    return item.uuid
  }

  constructor(props) {
    super(props)

    this.props.navigator.setButtons({
      leftButtons: [
        {
          title: 'Settings',
          icon: icons.settings,
          disableIconTint: true
        }
      ],
      rightButtons: [
        {
          title: 'Add',
          icon: icons.add,
          disableIconTint: true
        }
      ]
    })
  }

  render() {
    return (
      <FlatList
        style={styles.list}
        data={this.props.data}
        extraData={this.state}
        keyExtractor={Dashboard._keyExtractor}
        renderItem={Dashboard._renderItem}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
    // backgroundColor: '#F5FCFF'
  }
})
