import crypto from 'crypto-js'

const PASSWORD_SECRET_KEY = 'SECRET_KEY'

export function encrypt(password) {
  return crypto.AES.encrypt(password, PASSWORD_SECRET_KEY).toString()
}

export function decrypt(encrypted) {
  return crypto.AES.decrypt(encrypted, PASSWORD_SECRET_KEY).toString(crypto.enc.Utf8)
}
