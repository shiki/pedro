import _ from 'lodash'
import { BigNumber } from 'bignumber.js'
import check from 'offensive'
import fetch from 'node-fetch'
import moment from 'moment'

import constants from '../constants'
import DB from '../services/DB'

export const apiUrls = {
  stocks: 'STOCKS_URL'
}

async function start() {
  await DB.bootstrap()

  async function run() {
    await gather()
    setTimeout(run, 3000)
  }

  run()
  console.log('Started gatherer')
}

export async function gather() {
  const stocks = await fetchStocks()
  if (!stocks) {
    return
  }

  await Promise.all(filterFetchedStocks(stocks).map(stock => saveStock(stock)))
}

/**
 * Remove stocks that we don't want and update some that have wrong information (e.g. name).
 * @param {*} stocks 
 */
export function filterFetchedStocks(stocks) {
  const excludedSymbols = ['ALL', 'PSE']
  return stocks.filter(stock => excludedSymbols.indexOf(stock.symbol) < 0).map(stock => {
    if (stock.symbol === 'CEB') {
      return { ...stock, name: 'Cebu Air Inc.' }
    }
    return stock
  })
}

/**
 * @return {Promise<Object[]>}
 */
export async function fetchStocks() {
  try {
    const result = await fetch(apiUrls.stocks).then(res => {
      if (!res.ok) {
        console.error(`Failed to fetch from url ${res.url}: ${res.status} ${res.statusText}`)
        return null
      }
      return res.json()
    })

    if (result === null) {
      return result
    }

    check(result, 'result').is.anObject()
    check(result.stock, 'stocks list').is.anArray()
    check(result.as_of, 'as_of').is.aString()

    const asOf = new Date(result.as_of)
    return result.stock.map(stock => convertStockFromApiToDbCompatible(stock, asOf))
  } catch (e) {
    console.error(e)
    return null
  }
}

export function convertStockFromApiToDbCompatible(fromAPI, asOf) {
  check(asOf, 'asOf').is.anInstanceOf(Date)

  check(fromAPI, 'stock').is.anObject()
  check(fromAPI.name, 'stock.name').is.aString()
  check(fromAPI.percent_change, 'stock.percent_change').is.aNumber()
  check(fromAPI.symbol, 'stock.symbol').is.aString()
  check(fromAPI.price, 'stock.price').is.anObject()

  const price = fromAPI.price
  check(price.currency, 'price.currency').is.equalTo('PHP')
  check(price.amount, 'price.amount').is.aNumber()

  return {
    as_of: asOf,
    name: fromAPI.name,
    percent_change: new BigNumber(fromAPI.percent_change)
      .round(constants.number.decimalPlaces)
      .toFixed(),
    price: new BigNumber(price.amount).round(constants.number.decimalPlaces).toFixed(),
    symbol: fromAPI.symbol.toUpperCase()
  }
}

export async function saveStock(input) {
  let changed = false
  let output = await DB.shared.stocks.findOne({ symbol: input.symbol })
  if (!output) {
    output = await DB.shared.stocks.insert(input)
    changed = true
  } else if (!stocksAreEqual(output, input)) {
    const picked = _.pick(input, ['as_of', 'price', 'percent_change', 'name'])
    output = Object.assign({}, output, picked)
    output.updated_at = new Date()
    output = await DB.shared.stocks.update(output)
    changed = true
  }

  return { stock: output, changed }
}

export function stocksAreEqual(left, right) {
  [left, right].forEach(stock => {
    check(stock.as_of, 'as_of').is.anInstanceOf(Date)
    check(stock.name, 'name').is.aString()
    check(stock.percent_change, 'percent_change').is.aString()
    check(stock.price, 'price').is.aString()
    check(stock.symbol, 'symbol').is.aString()
  })

  // Can only compare the same symbol
  check(left.symbol, 'symbol').is.equalTo(right.symbol)

  if (!moment(left.as_of).isSame(right.as_of)) {
    return false
  }
  if (!new BigNumber(left.price).equals(right.price)) {
    return false
  }
  if (!new BigNumber(left.percent_change).equals(right.percent_change)) {
    return false
  }

  return left.name === right.name
}

export default { start }

if (!module.parent) {
  start()
}
