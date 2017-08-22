import { Navigation } from 'react-native-navigation'
import DashboardScreen from './modules/dashboard/DashboardScreen'
import { loadIcons } from './icons'

Navigation.registerComponent('screen.Dashboard', () => DashboardScreen)

export default async function bootstrap() {
  await loadIcons()

  Navigation.startSingleScreenApp({
    screen: {
      screen: 'screen.Dashboard',
      title: 'Pedro'
    }
  })
}
