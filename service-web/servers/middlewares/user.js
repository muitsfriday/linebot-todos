import { getTokenInfo } from '../line/token'


const validate = jwt => typeof jwt === 'string' && jwt.split('.').length === 3

export default (req, res, next) => {
  if (validate(req.cookies.jwt)) {
    req.user = getTokenInfo(req.cookies.jwt, process.env.LINE_SECRET)
    if ((new Date()).getTime() / 1000 > req.user.exp) {
      // expired
      res.cookie('jwt', null)
      req.user = null
    }
    req.token = req.cookies.jwt
  } else {
    res.cookie('jwt', null)
    req.user = null
  }
  next()
}
