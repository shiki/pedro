import Massive from 'massive'
import check from 'offensive'
import constants from '../constants'
// const monitor = require('pg-monitor')

let massive = null
let database = null

export default class DB {
  static bootstrap() {
    if (massive) {
      return massive
    }

    massive = Massive(constants.database)
    return massive.then(instance => {
      database = instance
      return database
    })
  }

  static get shared() {
    check(massive, 'massive').is.not.Null()
    check(database, 'shared instance').is.not.Null()

    return database
  }
}
