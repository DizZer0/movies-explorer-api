const jwt = require('jsonwebtoken');

const { AUTHORIZATION_REQUIRED } = require('../utils/constants')

const Unauthorized = require('../errors/Unauthorized');
const { devJwtKey } = require('../utils/config')

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized(AUTHORIZATION_REQUIRED));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : devJwtKey);
      req.user = payload._id;
      next();
    } catch (err) {
      next(new Unauthorized(AUTHORIZATION_REQUIRED));
    }
  }
};
