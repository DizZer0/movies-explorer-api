const User = require('../models/users');

const {
  INCORRECT_DATA,
  EMAIL_EXIST,
  SERVER_ERROR,
  USER_NOT_FOUND
} = required('../utils/constants')

const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const NoDataFound = require('../errors/NoDataFound');
const Conflict = require('../errors/Conflict')

module.exports.getUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(new NoDataFound(USER_NOT_FOUND))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(new ServerError(SERVER_ERROR));
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
        next(new ValidationError(INCORRECT_DATA));
      } else if (err.code === 11000) {
        next(new Conflict(EMAIL_EXIST));
      } else {
        next(new ServerError(SERVER_ERROR));
      }
    });
};
