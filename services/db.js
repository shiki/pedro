const Massive = require('massive')
const check = require('offensive')
// const monitor = require('pg-monitor')

let config = {
  host: 'localhost', 
  port: 5432, 
  database: 'pedro', 
  // user: 'pedro_hokage'
  user: 'pedro_user', 
  password: 'harvester_addicted_saddlebow_obeli_revaluate_birchen', 
}

if (process.env.NODE_ENV === 'test') {
  config.database = 'pedro_test'
}

let massive = null
let database = null

module.exports = {
  bootstrap: () => {
    if (massive) {
      return massive
    }

    massive = Massive(config)
    return massive.then(instance => {
      database = instance
      return database
    })
  },
  shared: () => {
    check(massive, 'massive').is.not.Null()
    check(database, 'shared instance').is.not.Null()

    return database
  }
}

