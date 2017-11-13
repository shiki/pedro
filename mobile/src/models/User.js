import moment from 'moment'
import check from 'offensive'

export default class User {
  /**
   * @type {string}
   */
  uuid = null
  /**
   * @type {string}
   */
  password = null
  /**
   * @type {string|null}
   */
  apns_key = null
  /**
   * @type {moment.Moment}
   */
  created_at = null
  /**
   * @type {moment.Moment}
   */
  updated_at = null
  /**
   * @type {boolean}
   */
  synchronized = false

  constructor({ uuid, password, apns_key = null, created_at = moment(), updated_at = moment(), synchronized = false }) {
    check(uuid, 'uuid').is.aString()
    check(password, 'password').is.aString()
    check(apns_key, 'apns_key').is.either.Null.or.aString()
    check(created_at, 'created_at').is.anInstanceOf(moment)
    check(updated_at, 'updated_at').is.anInstanceOf(moment)
    check(synchronized, 'synchronized').is.aBoolean()

    this.uuid = uuid
    this.password = password
    this.apns_key = apns_key
    this.created_at = created_at
    this.updated_at = updated_at
    this.synchronized = synchronized
  }

  /**
   * @param {Object} source
   * @return {User}
   */
  static fromDB(source) {
    const { uuid, password, apns_key, created_at, updated_at, synchronized } = source
    return new User({
      uuid,
      password,
      apns_key,
      created_at: moment(created_at),
      updated_at: moment(updated_at),
      synchronized: synchronized === 1
    })
  }

  /**
   * @param {User} user
   */
  static toDB(user) {
    const { uuid, password, apns_key, created_at, updated_at, synchronized } = user
    return {
      uuid,
      password,
      apns_key,
      created_at: created_at.toISOString(),
      updated_at: updated_at.toISOString(),
      synchronized: synchronized === true ? 1 : 0
    }
  }
}
