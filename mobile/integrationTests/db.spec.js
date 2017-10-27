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

    await client.saveUser(user)
    savedUser = await client.findUser({ uuid: user.uuid })
    expect(savedUser).not.to.be.null
    expect(savedUser.password).to.eq(user.password)
    expect(savedUser.apns_key).to.be.null
    expect(savedUser.created_at).not.to.be.null
    expect(savedUser.synchronized).to.eq(0)
  })
}
