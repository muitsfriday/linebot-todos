import { MongoClient } from 'mongodb'

const url = process.env.MONGODB_URI
let mongoInstance = null

const getConnection = () => new Promise((rs, rj) => {
  if (mongoInstance !== null) {
    return rs(mongoInstance)
  }

  return MongoClient.connect(url, (err, db) => {
    if (err) {
      return rj(err)
    }

    const s = url.split('/')
    const dbname = s[s.length - 1]
    const dbo = db.db(dbname)
    mongoInstance = dbo
    return rs(dbo)
  })
})

const getTodosByUserId = (userId, page = 1) => new Promise((rs, rj) => {
  const limit = 50
  const offset = (page - 1) * limit
  getConnection().then((connection) => {
    connection.collection('todos')
      .find({ userId })
      .sort({ important: -1, dueDate: -1 })
      .skip(offset)
      .limit(limit)
      .toArray((err, res) => {
        if (err) {
          return rj(err)
        }
        return rs(res)
      })
  })
})


export default getConnection
export {
  getConnection,
  getTodosByUserId,
}
