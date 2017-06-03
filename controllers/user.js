const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const User = require('../models/User');
const {
  LOGIN_SUCCESS,
  SIGN_UP_SUCCESS,
  ERROR_VALIDATION_FAILED,
  ERROR_SOMETHING_BAD_HAPPEND,
  ERROR_INVALID_EMAIL_PASSWORD,
  ERROR_EMAIL_ALREADY_EXISTS,
} = require('../consts');

const generateToken = user => jwt.sign({
  user: {
    id: user.id,
    email: user.email,
    profile: user.profile,
  },
}, process.env.JWT_SECRET, { expiresIn: '24h' });

const login = (req, res) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      code: ERROR_VALIDATION_FAILED,
      message: 'Validation Failed',
      errors,
    });
  }

  User.findOne({ email: req.body.email.toLowerCase() }, (err, user) => {
    if (err) {
      return res.status(500).send({
        code: ERROR_SOMETHING_BAD_HAPPEND,
        message: 'Something bad happened :(',
        errors: err,
      });
    }

    if (!user) {
      return res.status(401).send({
        code: ERROR_INVALID_EMAIL_PASSWORD,
        message: 'Invalid email or password',
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send({
          code: ERROR_SOMETHING_BAD_HAPPEND,
          message: 'Something bad happened :(',
          errors: err,
        });
      }

      if (isMatch) {
        const token = generateToken(user);
        return res.send({
          code: LOGIN_SUCCESS,
          message: 'Login success',
          token,
        });
      }

      return res.status(401).send({
        code: ERROR_INVALID_EMAIL_PASSWORD,
        message: 'Invalid email or password',
      });
    });
  });
};


const signup = (req, res) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      code: ERROR_VALIDATION_FAILED,
      message: 'Validation Failed',
      errors,
    });
  }

  const user = new User({
    id: uuid(),
    email: req.body.email,
    password: req.body.password,
    profile: {
      email: req.body.email,
    },
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return res.status(500).send({
        code: ERROR_SOMETHING_BAD_HAPPEND,
        message: 'Something bad happened :(',
        errors: err,
      });
    }

    if (existingUser) {
      return res.status(409).send({
        code: ERROR_EMAIL_ALREADY_EXISTS,
        message: 'Account with that email address already exists',
      });
    }

    user.save((err) => {
      if (err) {
        return res.status(500).send({
          code: ERROR_SOMETHING_BAD_HAPPEND,
          message: 'Something bad happened :(',
          errors: err,
        });
      }

      const token = generateToken(user);
      return res.send({
        code: SIGN_UP_SUCCESS,
        message: 'Sign up success',
        token,
      });
    });
  });
};

module.exports = {
  login,
  signup,
};
