import Realm from 'realm'

class User {}

User.schema = {
  name: 'User',
  primaryKey: 'uuid',
  properties: {
    uuid: { type: 'string' },
    apns_key: { type: 'string', optional: true },
    created_at: { type: 'date' },
    updated_at: { type: 'date' }
  }
}

const schema = [User]

export const db = {}

export async function loadDB() {
  return Realm.open({ schema }).then(realm => {
    db.realm = realm
    return db
  })
}
