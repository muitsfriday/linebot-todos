import express from 'express'
import cookieParser from 'cookie-parser'
import randomstring from 'randomstring'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'
import crypto from 'crypto'
import path from 'path'
import helmet from 'helmet'
import { getTodosByUserId } from './connectors/todos'


const app = express()
const port = process.env.PORT


const verify = (key, target, signature) => {
  console.log(key, target, signature)
  const hash = crypto.createHmac('sha256', Buffer.from(key, 'utf8')).update(Buffer.from(target, 'utf8')).digest('base64')
  const hashBuffer = Buffer.from(hash, 'base64')
  console.log(hashBuffer.toString('hex'))
  console.log(signature.toString('hex'))
  return crypto.timingSafeEqual(hashBuffer, signature)
}

const getTokenInfo = (idToken, secret) => {
  const tokenPart = idToken.split('.')
  const header = tokenPart[0]
  const payload = tokenPart[1]

  const payloadDecode = Buffer.from(payload, 'base64')
  const signatureDecode = Buffer.from(tokenPart[2], 'base64')

  const isValid = verify(secret, `${header}.${payload}`, signatureDecode)
  if (!isValid) {
    return false
  }

  return JSON.parse(payloadDecode.toString())
}

app.use(helmet.noCache())
app.use(cookieParser())
app.set('views', path.join(__dirname, 'view'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.send('Hello World 2')
})

app.get('/list-todo', async (req, res) => {
  if (!req.cookies.jwt) {
    return res.json({
      error: 'no user specified.',
    })
  }

  const info = getTokenInfo(req.cookies.jwt, process.env.LINE_SECRET)
  const userId = info.sub

  const result = await getTodosByUserId(userId)
  return res.json(result)
})

app.get('/edit', async (req, res) => {
  const secret = process.env.LINE_SECRET
  let userInfo = null

  if (req.query.code) {
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', req.query.code)
    params.append('redirect_uri', 'https://muitsfriday-linebot-web.herokuapp.com/edit')
    params.append('client_id', '1638113858')
    params.append('client_secret', secret)

    let fetchResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'post',
      body: params,
    })
    fetchResponse = await fetchResponse.json()

    const idToken = fetchResponse.id_token

    userInfo = getTokenInfo(idToken, secret)
    if (userInfo === false) {
      return res.send('cannot verify token info')
    }

    res.cookie('jwt', idToken, {
      httpOnly: true,
      secure: true,
    })
  }

  if (userInfo === null && req.cookies.jwt) {
    userInfo = getTokenInfo(req.cookies.jwt, secret)
  }

  if (userInfo) {
    const userId = userInfo.sub
    const result = await getTodosByUserId(userId)
    return res.render('edit', {
      todos: JSON.stringify(result),
    })
  }

  const random = randomstring.generate(13)
  const nonce = randomstring.generate(6)
  return res.redirect(301, `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1638113858&redirect_uri=https://muitsfriday-linebot-web.herokuapp.com/edit&state=${random}&scope=openid%20profile&nonce=${nonce}`)
})

app.listen(port, () => {
  console.log(`Listening ${port}`)
})
