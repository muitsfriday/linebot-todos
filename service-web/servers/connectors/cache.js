import redis from 'redis'

const url = process.env.REDIS_URL
let client = null

const connect = () => new Promise((rs) => {
  if (client != null) {
    return rs(client)
  }

  client = redis.createClient({
    url,
  })

  client.on('error', (err) => {
    console.log(`error: ${err}`)
  })

  return rs(client)
})


const set = (connection, key, field, value) => {
  connection.hset(key, field, value)
}

const get = (connection, key, field) => new Promise((rs, rj) => {
  connection.hget(key, field, (err, result) => {
    if (err) {
      return rj(err)
    }
    return rs(result)
  })
})

const remove = (connection, key) => connection.del(key)

export {
  // eslint-disable-next-line import/prefer-default-export
  connect,
  set,
  get,
  remove,
}
