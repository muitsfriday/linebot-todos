import { MongoClient, ObjectID } from 'mongodb'

const url = process.env.MONGODB_URI
const col = process.env.TODOS_COLL
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
  const limit = 3
  const offset = (page - 1) * limit
  console.log(offset, limit)
  getConnection().then((connection) => {
    connection.collection(col)
      .find({ userId })
      .sort({ important: -1, dueDate: 1 })
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

const changeTodoState = (userId, todoId, state) => new Promise((rs, rj) => {
  getConnection().then((connection) => {
    connection.collection(col)
      .updateOne({
        _id: new ObjectID(todoId),
        userId,
      }, { $set: { done: !!state } }, (err, res) => {
        if (err) {
          return rj(err)
        }
        return rs(res)
      })
  })
})

const changeImportantState = (userId, todoId, state) => new Promise((rs, rj) => {
  getConnection().then((connection) => {
    connection.collection(col)
      .updateOne({
        _id: new ObjectID(todoId),
        userId,
      }, { $set: { important: !!state } }, (err, res) => {
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
  changeTodoState,
  changeImportantState,
}
