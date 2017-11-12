import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'

import { DashboardScreen } from './modules/dashboard/DashboardScreen'
import { StockSelectionScreen } from './modules/alert/StockSelectionScreen'
import { AlertCreationScreen } from './modules/alert/AlertCreationScreen'
import { NotificationPermissionRequestScreen } from './modules/alert/NotificationPermissionRequestScreen'

import * as screenIDs from './screenIDs'

export default function registerScreens(store) {
  Navigation.registerComponent(screenIDs.DASHBOARD, () => DashboardScreen, store, Provider)
  Navigation.registerComponent(screenIDs.STOCK_SELECTION, () => StockSelectionScreen, store, Provider)
  Navigation.registerComponent(screenIDs.ALERT_CREATION, () => AlertCreationScreen, store, Provider)
  Navigation.registerComponent(screenIDs.NOTIFICATION_PERMISSION_REQUEST, () => NotificationPermissionRequestScreen, store, Provider)
}
