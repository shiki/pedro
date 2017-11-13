import moment from 'moment'
import check from 'offensive'
import { BigNumber } from 'bignumber.js'

import { toDBFormat } from '../utils/number'

export const OPERATOR_LESS_THAN = '<'
export const OPERATOR_GREATER_THAN = '>'

export class Alert {
  /**
   * @type {string}
   */
  uuid = null
  /**
   * @type {string}
   */
  user_uuid = null
  /**
   * @type {string}
   */
  stock_symbol = null
  /**
   * @type {string}
   */
  operator = null
  /**
   * @type {BigNumber}
   */
  price = null
  /**
   * @type {string}
   */
  notes = null
  /**
   * @type {boolean}
   */
  triggered = false
  /**
   * @type {moment.Moment}
   */
  created_at = null
  /**
   * @type {moment.Moment}
   */
  updated_at = null
  /**
   * @type {boolean}
   */
  synchronized = false

  constructor({
    uuid,
    user_uuid,
    stock_symbol,
    operator,
    price,
    notes = null,
    triggered = false,
    created_at = moment(),
    updated_at = moment(),
    synchronized = false
  }) {
    check(uuid, 'uuid').is.aString()
    check(user_uuid, 'user_uuid').is.aString()
    check(stock_symbol, 'stock_symbol').is.aString()
    check(operator, 'operator').is.oneOf([OPERATOR_LESS_THAN, OPERATOR_GREATER_THAN])
    check(price, 'price').is.anInstanceOf(BigNumber)
    check(notes, 'notes').is.either.aString.or.Null()
    check(triggered, 'triggered').is.aBoolean()
    check(created_at, 'created_at').is.anInstanceOf(moment)
    check(updated_at, 'updated_at').is.anInstanceOf(moment)
    check(synchronized, 'synchronized').is.aBoolean()

    this.uuid = uuid
    this.user_uuid = user_uuid
    this.stock_symbol = stock_symbol
    this.operator = operator
    this.price = price
    this.notes = notes
    this.triggered = triggered
    this.created_at = created_at
    this.updated_at = updated_at
    this.synchronized = synchronized
  }

  /**
   * @param {Object} source
   * @return {Alert}
   */
  static fromDB(source) {
    const { uuid, user_uuid, stock_symbol, operator, price, notes, triggered, created_at, updated_at, synchronized } = source
    return new Alert({
      uuid,
      user_uuid,
      stock_symbol,
      operator,
      price: new BigNumber(price),
      notes,
      triggered: triggered === 1,
      created_at: moment(created_at),
      updated_at: moment(updated_at),
      synchronized: synchronized === 1
    })
  }

  /**
   * @param {Alert} source
   * @return {Object}
   */
  static toDB(source) {
    const { uuid, user_uuid, stock_symbol, operator, price, notes, triggered, created_at, updated_at, synchronized } = source
    return {
      uuid,
      user_uuid,
      stock_symbol,
      operator,
      price: toDBFormat(price),
      notes,
      triggered: triggered === true ? 1 : 0,
      created_at: created_at.toISOString(),
      updated_at: updated_at.toISOString(),
      synchronized: synchronized === true ? 1 : 0
    }
  }
}
