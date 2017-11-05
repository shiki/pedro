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
   * Convert a DB query result to a Stock instance
   * 
   * @param {Object} source 
   * @param {string} source.symbol
   * @param {string} source.name
   * @param {string} source.as_of
   * @param {string} source.price
   * @param {string} source.percent_change
   * @param {string} updated_at
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

  /**
   * Convert an API result JSON to a Stock instance
   * 
   * @param {Object} source 
   * @param {string} source.symbol
   * @param {string} source.name
   * @param {string} source.as_of
   * @param {string} source.price
   * @param {string} source.percent_change
   * @param {string} updated_at
   * @return {Stock}
   */
  static fromAPI(source) {
    ['symbol', 'name', 'as_of', 'price', 'percent_change', 'updated_at'].forEach(prop => check(source[prop], prop).is.aString())

    const { symbol, name } = source
    return new Stock({
      symbol,
      name,
      as_of: moment(source.as_of),
      price: new BigNumber(source.price),
      percent_change: new BigNumber(source.percent_change),
      updated_at: moment(source.updated_at)
    })
  }
}
