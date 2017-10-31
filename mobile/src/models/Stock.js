import moment from 'moment'
import check from 'offensive'
import { BigNumber } from 'bignumber.js'

import { number as numberConfig } from '../config'

export default class Stock {
  /**
   * @type {string}
   */
  symbol = null
  /**
   * @type {string}
   */
  name = null
  /**
   * @type {moment.Moment}
   */
  as_of = null
  /**
   * @type {BigNumber}
   */
  price = null
  /**
   * @type {BigNumber}
   */
  percent_change = null
  /**
   * @type {moment.Moment}
   */
  updated_at = null

  constructor({ symbol, name, as_of, price, percent_change, updated_at }) {
    check(symbol, 'symbol').is.aString()
    check(name, 'name').is.aString()
    check(as_of, 'as_of').is.anInstanceOf(moment)
    check(price, 'price').is.anInstanceOf(BigNumber)
    check(percent_change, 'percent_change').is.anInstanceOf(BigNumber)
    check(updated_at, 'updated_at').is.anInstanceOf(moment)

    this.symbol = symbol
    this.name = name
    this.as_of = as_of
    this.price = price
    this.percent_change = percent_change
    this.updated_at = updated_at
  }

  /**
   * @param {Object} source 
   * @return {Stock}
   */
  static fromDB(source) {
    const { symbol, name, as_of, price, percent_change, updated_at } = source
    return new Stock({
      symbol,
      name,
      as_of: moment(as_of),
      price: new BigNumber(price),
      percent_change: new BigNumber(percent_change),
      updated_at: moment(updated_at)
    })
  }

  /**
   * @param {Stock} source 
   */
  static toDB(source) {
    const { symbol, name, as_of, price, percent_change, updated_at } = source
    return {
      symbol,
      name,
      as_of: as_of.toISOString(),
      price: price.toFixed(numberConfig.DECIMAL_PLACES),
      percent_change: percent_change.toFixed(numberConfig.DECIMAL_PLACES),
      updated_at: updated_at.toISOString()
    }
  }
}
