/* eslint-disable no-unused-expressions */

import moment from 'moment'
import { expect } from 'chai'

import { database } from '../../src/services/db'
import { User } from '../../src/models'

export default function dbUsersSpec(spec) {
  const { beforeEach, it, test } = spec

  beforeEach(async () => {
    await database.deleteAll()
  })

  it('can save a user', async () => {
    // Arrange
    const user = new User({ uuid: '__temp__', password: '__pass__' })

    let savedUser = await database.findUser(user.uuid)
    expect(savedUser).to.be.null

    // Act
    await database.saveUser(user)

    // Assert
    savedUser = await database.findUser(user.uuid)
    expect(savedUser).not.to.be.null
    expect(savedUser).to.be.instanceOf(User)
    expect(savedUser.password).to.eq(user.password)
    expect(savedUser.apns_key).to.be.null
    expect(savedUser.created_at).to.be.instanceOf(moment)
    expect(savedUser.updated_at).to.be.instanceOf(moment)
    expect(savedUser.synchronized).to.eq(false)
  })

  it('overwrites a user with the same uuid', async () => {
    // Arrange
    const user = new User({ uuid: '__temp__', password: '__pass__' })
    await database.saveUser(user)

    // Act
    user.password = 'word'
    await database.saveUser(user)

    // Assert
    const savedUser = await database.findUser(user.uuid)
    expect(savedUser.password).to.eq('word')
  })

  it('can find a user', async () => {
    // Arrange
    await database.saveUser(new User({ uuid: '__temp__', password: 'p' }))
    await database.saveUser(new User({ uuid: 'find_me', password: '__pass__' }))

    // Act
    const user = await database.findUser('find_me')

    // Assert
    expect(user).to.be.instanceOf(User)
    expect(user.uuid).to.eq('find_me')
    expect(user.password).to.eq('__pass__')
  })

  test('findUser returns null if the user does not exist', async () => {
    const user = await database.findUser('__uuid__')

    expect(user).to.be.null
  })
}
