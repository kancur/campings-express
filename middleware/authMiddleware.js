const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  
  const token = req.cookies.jwt

  console.log('--requiring auth--')
  console.log('--cookies--', req.cookies)
  console.log('--jwt token ---> ', token)

  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log(err.message)
        next()
      } else {
        const user = await User.findById(decodedToken.id).select('-password -__v').lean()
  
        console.log('--user ---> ', user)

        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

module.exports = { requireAuth }