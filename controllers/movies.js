const Movie = require('../models/movies');

const {
  INCORRECT_DATA,
  SERVER_ERROR,
  NO_SAVED_MOVIES,
  INVALID_ID,
  MOVIE_NOT_FOUND
} = require("../utils/constants")

const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const NoDataFound = require('../errors/NoDataFound');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user })
    .then((movies) => {
      if (!movies) {
        next(new NoDataFound(NO_SAVED_MOVIES));
      } else {
        res.send(movies);
      }
    })
    .catch((err) => {
      next(new ServerError(SERVER_ERROR));
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail, movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      console.log(err)
      if (err.name === 'ValidationError') {
        next(new ValidationError(INCORRECT_DATA));
      } else {
        next(new ServerError(SERVER_ERROR));
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        next(new NoDataFound(MOVIE_NOT_FOUND));
      } else {
        return Movie.findByIdAndRemove(req.params._id)
          .then(() => res.send(movie));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(INVALID_ID));
      } else {
        next(new ServerError(SERVER_ERROR));
      }
    });
};
