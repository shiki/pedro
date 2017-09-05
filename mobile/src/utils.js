import crypto from 'crypto-js'

import { passwordSecretKey } from './constants'

export function encryptPassword(password) {
  return crypto.AES.encrypt(password, passwordSecretKey).toString(crypto.enc.Utf8)
}

export function decryptPassword(encrypted) {
  return crypto.AES.decrypt(encrypted, passwordSecretKey).toString(crypto.enc.Utf8)
}
