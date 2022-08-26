import jwt from 'jsonwebtoken'

export default function jwtTokenValidate(req, res, next) {

  const token = req.headers['authorization']
  
  if (token === null) return res.sendStatus(401)

  jwt.verify(token, process.env.SECRET_KEY, async (err, resultOfVerify) => {
    if (err) return res.sendStatus(403)

    req.userId = resultOfVerify.userId
    next()
  })
}
