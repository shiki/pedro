import Config from 'react-native-config'

export const API_BASE_URL = 'http://localhost:8000'

export const database = {
  DEBUG: true
}

export const number = {
  DECIMAL_PLACES: 6
}

export function shouldRunIntegrationApp() {
  console.log('app_target', Config.APP_TARGET)
  return Config.APP_TARGET === 'integration'
}
