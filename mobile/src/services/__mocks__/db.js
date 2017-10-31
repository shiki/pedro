// src/services/__mocks__/db.js

let users = {}

export const database = {
  deleteAll: jest.fn(() => {
    users = {}
  }),
  saveUser: jest.fn(user => {
    users[user.uuid] = user
  }),
  findUser: jest.fn(({ uuid }) => users[uuid]),
  findAllUsers: () => Object.values(users)
}

export default { database }
