import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'

import { DashboardScreen } from './modules/dashboard/DashboardScreen'
import { StockSelectionScreen } from './modules/alert/StockSelectionScreen'

import * as screenIDs from './screenIDs'

export default function registerScreens(store) {
  Navigation.registerComponent(screenIDs.DASHBOARD, () => DashboardScreen, store, Provider)
  Navigation.registerComponent(screenIDs.STOCK_SELECTION, () => StockSelectionScreen, store, Provider)
}
