import { expect } from 'chai'

import { client } from '../src/services/db'

export default function db(test) {
  const { beforeEach, it } = test

  beforeEach(async () => {
    await client.deleteAll()
  })

  it('can save a user', async () => {
    const user = {
      uuid: '_temp_',
      password: '_pass_',
      apns_key: null
    }

    let savedUser = await client.findUser({ uuid: user.uuid })
    expect(savedUser).to.be.null
    // assertTrue(savedUser === null, 'user should not exist yet')

    await client.saveUser(user)
    savedUser = await client.findUser({ uuid: user.uuid })
    expect(savedUser).not.to.be.null
    // assertTrue(savedUser !== null)
  })

  // it('works', () => {
  //   console.log('i am from db.test.js')
  //   assertTrue(false)
  // })

  // it('does not work', () => {
  //   assertTrue(false)
  // })
}
