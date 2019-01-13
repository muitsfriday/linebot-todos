import express from 'express'
import cookieParser from 'cookie-parser'
import randomstring from 'randomstring'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import path from 'path'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { getTodosByUserId, changeTodoState, changeImportantState } from './connectors/todos'
import { getTokenInfo } from './line/token'
import userJWT from './middlewares/user'

const app = express()
const port = process.env.PORT

app.use(helmet.noCache())
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')))
app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(userJWT)
app.set('views', path.join(__dirname, '..', 'view'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.send('Hello World 3')
})

app.get('/list', async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'no user specified.',
    })
  }
  console.log('oooo', req.query.page, parseInt(req.query.page, 10) || 1)
  const userId = req.user.sub
  const result = await getTodosByUserId(userId, parseInt(req.query.page, 10) || 1)

  const jsonResult = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const v of result) {
    // eslint-disable-next-line no-underscore-dangle
    jsonResult[v._id] = v
  }

  return res.json(jsonResult)
})

app.post('/done', async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'no user specified.',
    })
  }

  const { taskId, flag } = req.body
  const userId = req.user.sub
  const result = await changeTodoState(userId, taskId, flag)
  return res.json(result)
})

app.post('/important', async (req, res) => {
  if (!req.user) {
    return res.json({
      error: 'no user specified.',
    })
  }

  const { taskId, flag } = req.body
  const userId = req.user.sub
  const result = await changeImportantState(userId, taskId, flag)
  return res.json(result)
})

app.get('/edit', async (req, res) => {
  const secret = process.env.LINE_SECRET
  const redirect = `${process.env.BASE_URI}/edit`
  let idToken = ''
  let userInfo = null

  if (req.query.code) {
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', req.query.code)
    params.append('redirect_uri', redirect)
    params.append('client_id', process.env.LINE_CLIENT_ID)
    params.append('client_secret', secret)

    let fetchResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'post',
      body: params,
    })
    fetchResponse = await fetchResponse.json()

    idToken = fetchResponse.id_token

    userInfo = getTokenInfo(idToken, secret)
    if (userInfo === false) {
      return res.send('cannot verify token info')
    }

    req.token = idToken

    res.cookie('jwt', idToken, {
      httpOnly: true,
      secure: true,
    })
  }

  if (req.user) {
    const userId = req.user.sub
    const result = await getTodosByUserId(userId)
    const jsonResult = {}
    // eslint-disable-next-line no-restricted-syntax
    for (const v of result) {
      // eslint-disable-next-line no-underscore-dangle
      jsonResult[v._id] = v
    }
    return res.render('edit', {
      todos: JSON.stringify(jsonResult),
      token: req.token,
    })
  }

  const random = randomstring.generate(13)
  const nonce = randomstring.generate(6)

  return res.redirect(301, `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1638113858&redirect_uri=${encodeURIComponent(redirect)}&state=${random}&scope=openid%20profile&nonce=${nonce}`)
})

app.listen(port, () => {
  console.log(`Listening ${port}`)
})
