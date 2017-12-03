/* eslint-disable no-unused-expressions */

import moment from 'moment'
import { expect } from 'chai'
import { BigNumber } from 'bignumber.js'

import { database } from '../../src/services/db'
import { User, Stock, Alert, OPERATOR_GREATER_THAN, OPERATOR_LESS_THAN } from '../../src/models'

export default function dbAlertsSpec(spec) {
  const { beforeEach, it, test } = spec

  /**
   * @type {User}
   */
  let user = null

  /**
   * @type {Stock}
   */
  let ap = null
  /**
   * @type {Stock}
   */
  let mer = null

  beforeEach(async () => {
    await database.deleteAll()

    user = new User({ uuid: '__temp__', password: '__pass__' })
    await database.saveUser(user)

    ap = new Stock({
      symbol: 'AP',
      name: 'Aboitiz',
      as_of: moment(),
      price: new BigNumber(301.123456),
      percent_change: new BigNumber(220.451),
      updated_at: moment()
    })
    await database.saveStock(ap)

    mer = new Stock({
      symbol: 'MER',
      name: 'Meralco',
      as_of: moment(),
      price: new BigNumber(301.123456),
      percent_change: new BigNumber(220.451),
      updated_at: moment().add(-1, 'days')
    })
    await database.saveStock(mer)
  })

  it('can save an alert', async () => {
    // Arrange
    const uuid = '_alert_'
    const alert = new Alert({ uuid: '_alert_', user_uuid: user.uuid, stock_symbol: ap.symbol, operator: OPERATOR_LESS_THAN, price: new BigNumber(100) })
    expect(await database.findAlert(uuid)).to.be.null

    // Act
    await database.saveAlert(alert)

    // Assert
    const saved = await database.findAlert({ uuid: '_alert_' })
    expect(saved).to.be.instanceof(Alert)
    expect(saved.uuid).to.eq(uuid)
    expect(saved.user_uuid).to.eq(user.uuid)
    expect(saved.stock_symbol).to.eq(ap.symbol)
    expect(saved.operator).to.eq(OPERATOR_LESS_THAN)
    expect(saved.price).to.be.instanceof(BigNumber)
    expect(saved.price.toNumber()).to.eq(100)
    expect(saved.created_at).to.be.instanceof(moment)
    expect(saved.updated_at).to.be.instanceof(moment)
    expect(saved.synchronized).to.be.false
  })

  it('cannot save an alert with invalid user_uuid', async () => {
    // Arrange
    const uuid = '_alert_'
    const alert = new Alert({ uuid: '_alert_', user_uuid: '_invalid_', stock_symbol: ap.symbol, operator: OPERATOR_LESS_THAN, price: new BigNumber(100) })
    expect(await database.findAlert(uuid)).to.be.null

    // Act
    let thrownError = null
    try {
      await database.saveAlert(alert)
    } catch (error) {
      thrownError = error
      expect(error).to.be.an('error')
      expect(error.message).to.contain('FOREIGN KEY constraint failed')
    }
    expect(thrownError).to.be.an('error')

    // Assert
    const saved = await database.findAlert(uuid)
    expect(saved).to.be.null
  })

  it('cannot save an alert with invalid stock', async () => {
    // Arrange
    const uuid = '_alert_'
    const alert = new Alert({ uuid: '_alert_', user_uuid: user.uuid, stock_symbol: '_invalid_', operator: OPERATOR_LESS_THAN, price: new BigNumber(100) })
    expect(await database.findAlert(uuid)).to.be.null

    // Act
    let thrownError = null
    try {
      await database.saveAlert(alert)
    } catch (error) {
      thrownError = error
      expect(error).to.be.an('error')
      expect(error.message).to.contain('FOREIGN KEY constraint failed')
    }
    expect(thrownError).to.be.an('error')

    // Assert
    const saved = await database.findAlert(uuid)
    expect(saved).to.be.null
  })

  it('can find alerts by a specific user', async () => {
    // Arrange
    const otherUser = new User({ uuid: '__other__', password: '__pass__' })
    await database.saveUser(otherUser)

    let alert = new Alert({ uuid: '__001__', user_uuid: user.uuid, stock_symbol: ap.symbol, operator: OPERATOR_LESS_THAN, price: new BigNumber(100) })
    await database.saveAlert(alert)
    alert = new Alert({ uuid: '__002__', user_uuid: user.uuid, stock_symbol: ap.symbol, operator: OPERATOR_LESS_THAN, price: new BigNumber(100) })
    await database.saveAlert(alert)
    alert = new Alert({ uuid: '__003__', user_uuid: otherUser.uuid, stock_symbol: ap.symbol, operator: OPERATOR_LESS_THAN, price: new BigNumber(100) })
    await database.saveAlert(alert)

    // Act
    const foundAlerts = await database.findAlerts(user.uuid)

    // Assert
    expect(foundAlerts).to.have.lengthOf(2)
    const uuids = foundAlerts.map(a => a.uuid)
    expect(uuids).to.have.same.members(['__001__', '__002__'])
  })
}
