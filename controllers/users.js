const User = require('../models/users');

const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const NoDataFound = require('../errors/NoDataFound');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new NoDataFound('Пользователь с таким id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id'));
      } else {
        next(new ServerError('произошла ошибка'));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user,
    { email: email, name: name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};
