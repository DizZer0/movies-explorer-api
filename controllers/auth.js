const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/users');

const ValidationError = require('../errors/ValidationError');
const Conflict = require('../errors/Conflict');
const ServerError = require('../errors/ServerError');
const Unauthorized = require('../errors/Unauthorized');

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
        next(new ValidationError('Некорректные данные'));
      } else if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      console.log(NODE_ENV)
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.send({ message: 'Авторизация успешна', token: token });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new Unauthorized('Неправильные почта или пароль'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};
