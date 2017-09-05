import Realm from 'realm'

export class User extends Realm.Object {}

User.schema = {
  name: 'User',
  primaryKey: 'uuid',
  properties: {
    uuid: { type: 'string' },
    password: { type: 'string', optional: true },
    apns_key: { type: 'string', optional: true },
    created_at: { type: 'date' },
    updated_at: { type: 'date' },
    synchronized: { type: 'bool', default: false }
  }
}

export class Stock extends Realm.Object {}

Stock.schema = {
  name: 'Stock',
  primaryKey: 'symbol',
  properties: {
    symbol: { type: 'string' },
    as_of: { type: 'date' },
    price: { type: 'double' },
    percent_change: { type: 'double' },
    created_at: { type: 'date' },
    updated_at: { type: 'date' }
  }
}

export class Alert extends Realm.Object {}

Alert.schema = {
  name: 'Alert',
  primaryKey: 'uuid',
  properties: {
    uuid: { type: 'string' },
    user: { type: 'User' },
    stock: { type: 'Stock' },
    operator: { type: 'string' },
    price: { type: 'double' },
    notes: { type: 'string' },
    triggered: { type: 'bool', default: false },
    triggered_at: { type: 'date', optional: true },
    created_at: { type: 'date' },
    updated_at: { type: 'date' },
    is_deleted: { type: 'bool', default: false },
    synchronized: { type: 'bool', default: false }
  }
}

const schema = [User, Stock, Alert]

export const db = {}

export async function loadDB() {
  return Realm.open({ schema }).then(realm => {
    db.realm = realm
    return db
  })
}

/**
 * Realm is not quite compatible with Redux. This function extracts the properties of a Realm.Object instance and returns just a pure 
 * object.
 * 
 * @see https://github.com/realm/realm-js/issues/141
 * @param {Realm.Object} realmObject 
 */
export function toImmutable(realmObject) {
  return Object.keys(realmObject.constructor.schema.properties).reduce((prev, key) => ({ ...prev, [key]: realmObject[key] }), {})
}
