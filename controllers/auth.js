const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/users');

const {
  INCORRECT_DATA,
  EMAIL_EXIST,
  SERVER_ERROR,
  WRONG_EMAIL_OR_PASSWORD
} = require('../utils/constants')

const ValidationError = require('../errors/ValidationError');
const Conflict = require('../errors/Conflict');
const ServerError = require('../errors/ServerError');
const Unauthorized = require('../errors/Unauthorized');
const { devJwtKey } = require('../utils/config')


module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email: email,
      password: hash,
      name: name,
    }))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      _id: user._id
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(INCORRECT_DATA));
      } else if (err.code === 11000) {
        next(new Conflict(EMAIL_EXIST));
      } else {
        next(new ServerError(SERVER_ERROR));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      console.log(NODE_ENV)
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devJwtKey);
      res.send({ message: 'Авторизация успешна', token: token });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new Unauthorized(WRONG_EMAIL_OR_PASSWORD));
      } else {
        next(new ServerError(SERVER_ERROR));
      }
    });
};
