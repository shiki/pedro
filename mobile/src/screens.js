import { Navigation } from 'react-native-navigation'
import { Provider } from 'react-redux'

import DashboardScreen from './modules/dashboard/DashboardScreen'
import AlertSelectionScreen from './modules/alert/AlertSelectionScreen'

export function registerScreens(store) {
  Navigation.registerComponent('screen.Dashboard', () => DashboardScreen, store, Provider)
  Navigation.registerComponent('screen.AlertSelection', () => AlertSelectionScreen, store, Provider)
}

export default { registerScreens }
