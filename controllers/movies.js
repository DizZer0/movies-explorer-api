const Movie = require('../models/movies');

const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const NoDataFound = require('../errors/NoDataFound');

/*  Нужно брать айди пользователя, который сохранен после авторизации */

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user })
    .then((movies) => {
      if (!movies) {
        next(new NoDataFound('У вас нет сохраненных фильмов'));
      } else {
        res.send(movies);
      }
    })
    .catch((err) => {
      next(new ServerError('Произошла ошибка'));
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
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        next(new NoDataFound('Фильм с таким id не найден'));
      } else {
        return Movie.findByIdAndRemove(req.params.id)
          .then(() => res.send(movie));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};
