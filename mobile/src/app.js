import { Navigation } from 'react-native-navigation'
import Dashboard from './screens/Dashboard'

Navigation.registerComponent('screen.Dashboard', () => Dashboard)

export default function bootstrap() {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'screen.Dashboard',
      title: 'Pedro'
    }
  })
}
