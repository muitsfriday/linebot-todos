import crypto from 'crypto'


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

export {
  verify,
  getTokenInfo,
}
