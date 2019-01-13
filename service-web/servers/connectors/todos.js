import { MongoClient, ObjectID } from 'mongodb'
import { connect as cache, set as setCache, get as getCache, remove as removeCache } from './cache'

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
  cache().then(client => getCache(client, `user:${userId}:todos`, page)).then((val) => {
    if (val !== null) {
      return rs(JSON.parse(val).data)
    }
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
          cache().then(client => setCache(client, `user:${userId}:todos`, page, JSON.stringify({ data: res })))
          return rs(res)
        })
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
        cache().then(client => removeCache(client, `user:${userId}:todos`))
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
        cache().then(client => removeCache(client, `user:${userId}:todos`))
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
