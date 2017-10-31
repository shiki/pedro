// src/services/__mocks__/db.js

let users = {}

export const database = {
  deleteAll: jest.fn(
    () =>
      new Promise(resolve => {
        users = {}
        resolve()
      })
  ),

  saveUser: jest.fn(
    user =>
      new Promise(resolve => {
        users[user.uuid] = user
        resolve()
      })
  ),

  findUser: jest.fn(
    ({ uuid }) =>
      new Promise(resolve => {
        resolve(users[uuid])
      })
  ),

  findAllUsers: jest.fn(
    () =>
      new Promise(resolve => {
        resolve(Object.values(users))
      })
  )
}

export default { database }
