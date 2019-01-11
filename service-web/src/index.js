import express from 'express'
import randomstring from 'randomstring'

const app = express()
const port = process.env.PORT


app.get('/', (req, res) => {
  res.send('Hello World')
})


let user = null

app.get('/edit', (req, res) => {
  if (req.query.code) {
    res.send(req.query.code)
    return
  }

  if (user === null) {
    const uri = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`)s
    const random = randomstring.generate(13)
    const nonce = randomstring.generate(6)
    res.redirect(301, `https://access.line.me/oauth2/v2.1/authorize?response_type=code\
    &client_id=1638113858&redirect_uri=${uri}&state=${random}&scope=openid%20profile&nonce=${nonce}`)
    return
  }

  user = 0
})

app.listen(port, () => {
  console.log(`Listening ${port}`)
})

