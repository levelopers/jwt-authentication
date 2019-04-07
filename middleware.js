//  In the middleware.js, we can write a function that acts as middleware to 
//get a token from a request and proceeds only when the token is validated.

let jwt = require('jsonwebtoken')
const config = require('./jwtConfig')

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']
  //OAuth 2.0 framework 'bearer' token type
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  if (token) {
    console.log(token);
    
    jwt.verify(token, config, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid"
        })
      } else {
        //bind on request
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied"
    })
  }
}

module.exports = { checkToken }

