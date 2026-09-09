const jwt = require("jsonwebtoken")

function verifyToken(req, res, next) {
  try {
    
      const token = req.headers.authorization.split(" ")[1]
      const payload = jwt.verify(token, process.env.TOKEN_SECRET)
      req.payload = payload // moving the payload info to the route, becase WE WILL NEED IT.
      next() // move the route.

  } catch (error) { 
    // if the token doesn't exist
    // if the token is invalid
    // if the token has expired
    res.status(401).json({errorMessage: "Token doesn't exist or is not valid"})
  }
}

module.exports = {
  verifyToken
}