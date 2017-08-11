import { Navigation } from 'react-native-navigation'
import Dashboard from './screens/Dashboard'
import { icons, loadIcons } from './icons'

Navigation.registerComponent('screen.Dashboard', () => Dashboard)

export default async function bootstrap() {
  await loadIcons()

  Navigation.startSingleScreenApp({
    screen: {
      screen: 'screen.Dashboard',
      title: 'Pedro'
    }
  })
}
