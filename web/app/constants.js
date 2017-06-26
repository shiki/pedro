
// Can be development, production, or test
const environment = process.env.NODE_ENV || 'development'

const database = (() => {
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

export default {
  clientIds: ['CLIENT_ID'],
  jwtSecretKey: 'JWT_SECRET_KEY',
  rollbarAccessToken: 'ROLLBAR_ACCESS_TOKEN',
  database
}
