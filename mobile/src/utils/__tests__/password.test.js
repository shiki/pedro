import uuidv4 from 'uuid/v4'

import { encrypt, decrypt } from '../password'

test('encryption is reversible', () => {
  const source = uuidv4()

  const encrypted = encrypt(source)
  expect(typeof encrypted).toBe('string')
  expect(encrypted).not.toEqual(source)

  const decrypted = decrypt(encrypted)
  expect(decrypted).toBe(source)
})
