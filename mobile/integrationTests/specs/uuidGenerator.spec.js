import { expect } from 'chai'

import UUIDGenerator from 'react-native-uuid-generator'

export default function uuidGeneratorSpec(spec) {
  const { test } = spec

  test('it generates a UUID', async () => {
    const uuid = await UUIDGenerator.getRandomUUID()
    expect(uuid).to.have.lengthOf(36)

    const numberOfDashes = (uuid.match(/-/g) || []).length
    expect(numberOfDashes).to.eq(4)
  })
}
