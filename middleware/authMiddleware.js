const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        console.log(err.message);
        next();
      } else {
        const user = await User.findById(decodedToken.id)
          .select('-password -__v')
          .lean();
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const requireAuthResHandler = (req, res, next) => {
  if (res.locals.user === null) {
    res.status(401).json({ error: 'unauthorized' });
  } else {
    next();
  }
};

module.exports = { requireAuth, requireAuthResHandler };
