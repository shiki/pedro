import { createSelector } from 'reselect'

const getStocksMap = state => state.stocks.map

const stockComparator = (left, right) => left.symbol.localeCompare(right.symbol)

export const getStocksSortedList = createSelector([getStocksMap], map =>
  Object.values(map)
    .slice()
    .sort(stockComparator)
)

export default { getStocksSortedList }
