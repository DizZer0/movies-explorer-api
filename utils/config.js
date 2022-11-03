const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

const moviesdb = 'mongodb://localhost:27017/bitfilmsdb';

const devJwtKey = 'dev-secret';

module.exports = { 
  limiter,
  moviesdb,
  devJwtKey
};