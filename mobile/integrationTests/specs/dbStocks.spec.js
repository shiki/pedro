/* eslint-disable no-unused-expressions */

import moment from 'moment'
import { expect } from 'chai'
import { BigNumber } from 'bignumber.js'

import { database } from '../../src/services/db'
import { Stock } from '../../src/models'

export default function dbStocks(spec) {
  const { beforeEach, it, test } = spec

  beforeEach(async () => {
    await database.deleteAll()
  })

  it('can save a stock', async () => {
    // Arrange
    const stock = new Stock({
      symbol: 'AP',
      name: 'Aboitiz',
      as_of: moment()
        .add(-2, 'days')
        .startOf('day'),
      price: new BigNumber(301.123456),
      percent_change: new BigNumber(220.451),
      updated_at: moment()
        .add(-1, 'days')
        .startOf('day')
    })

    let savedStock = await database.findStock(stock.symbol)
    expect(savedStock).to.be.null

    // Act
    await database.saveStock(stock)

    // Assert
    savedStock = await database.findStock(stock.symbol)
    expect(savedStock).not.to.be.null
    expect(savedStock).to.be.instanceOf(Stock)
    expect(savedStock.name).to.eq(stock.name)
    expect(savedStock.as_of.isSame(stock.as_of)).to.be.true
    expect(savedStock.as_of).to.be.instanceOf(moment)
    expect(savedStock.price.toString()).to.eq('301.123456')
    expect(savedStock.percent_change.toString()).to.eq('220.451')
    expect(savedStock.updated_at).to.be.instanceOf(moment)
    expect(savedStock.updated_at.isSame(stock.updated_at)).to.be.true

    expect(moment().isAfter(savedStock.as_of)).to.be.true
    expect(moment().isAfter(savedStock.updated_at)).to.be.true
  })

  it('overwrites a stock with the same symbol', async () => {
    // Arrange
    const stock = new Stock({
      symbol: 'AP',
      name: 'Aboitiz',
      as_of: moment()
        .add(-2, 'days')
        .startOf('day'),
      price: new BigNumber(301.123456),
      percent_change: new BigNumber(220.451),
      updated_at: moment()
        .add(-1, 'days')
        .startOf('day')
    })
    await database.saveStock(stock)

    // Act
    stock.name = 'Aboitiz Power'
    await database.saveStock(stock)

    // Assert
    const savedStock = await database.findStock('AP')
    expect(savedStock.symbol).to.eq('AP')
    expect(savedStock.name).to.eq('Aboitiz Power')
  })

  it('can find the last updated stock', async () => {
    // Arrange
    const ap = new Stock({
      symbol: 'AP',
      name: 'Aboitiz',
      as_of: moment(),
      price: new BigNumber(301.123456),
      percent_change: new BigNumber(220.451),
      updated_at: moment()
    })
    await database.saveStock(ap)

    const mer = new Stock({
      symbol: 'MER',
      name: 'Meralco',
      as_of: moment(),
      price: new BigNumber(301.123456),
      percent_change: new BigNumber(220.451),
      updated_at: moment().add(-1, 'days')
    })
    await database.saveStock(mer)

    // Act
    const lastUpdated = await database.findLastUpdatedStock()

    // Assert
    expect(lastUpdated).not.to.be.null
    expect(lastUpdated.symbol).to.eq(ap.symbol)
  })

  test('findLatestUpdatedStock returns null if there are no stocks', async () => {
    const lastUpdated = await database.findLastUpdatedStock()
    expect(lastUpdated).to.be.null
  })
}
