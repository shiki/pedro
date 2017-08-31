import Realm from 'realm'

class User {}

User.schema = {
  name: 'User',
  primaryKey: 'uuid',
  properties: {
    uuid: { type: 'string' },
    apns_key: { type: 'string', optional: true },
    created_at: { type: 'date' },
    updated_at: { type: 'date' },
    synchronized: { type: 'bool', default: false }
  }
}

class Stock {}

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

class Alert {}

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
