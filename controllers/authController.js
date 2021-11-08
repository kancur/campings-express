const { body } = require('express-validator');
const validationResultHandlerMiddleware = require('../middleware/validationResultHanderMiddleware');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middleware/authMiddleware');

const MAX_AGE = 180 * 24 * 60 * 60; // days * h * m * s

exports.signup_post = [
  body('email', 'Please enter a valid email').trim().isString().isEmail(),
  body('password', 'Password must be atleast 7 characters long')
    .isString()
    .isLength({ min: 7 }),
  validationResultHandlerMiddleware,

  async function (req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id, email);
      res.status(201).json({ user: user.id, jwt: token, expiresIn: MAX_AGE });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
    }
  },
];

exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ user: user.id, jwt: token, expiresIn: MAX_AGE });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.current_user_get = [
  requireAuth,
  async (req, res) => {
    res.json({...res.locals.user})
  }
]

const createToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.SECRET, {
    expiresIn: MAX_AGE,
  });
};