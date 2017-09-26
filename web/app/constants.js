// Can be development, production, or test
const environment = process.env.NODE_ENV || 'development'

const MASSIVE_CONNECTION_INFO = (() => {
  const config = {
    host: 'localhost',
    port: 5432,
    database: 'pedro',
    user: 'pedro_user',
    password: 'harvester_addicted_saddlebow_obeli_revaluate_birchen'
  }

  if (environment === 'production') {
    config.host = 'postgres'
  } else if (environment === 'test') {
    config.database = 'pedro_test'
  }

  return config
})()

const number = {
  DECIMAL_PLACES: 6
}

export default {
  CLIENT_IDS: ['CLIENT_ID'],
  ROLLBAR_ACCESS_TOKEN: 'ROLLBAR_ACCESS_TOKEN',
  MASSIVE_CONNECTION_INFO,
  number
}
