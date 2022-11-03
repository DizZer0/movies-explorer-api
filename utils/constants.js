const ERROR_CODE_CONFLICT = 409;
const ERROR_CODE_FORBIDDEN = 403;
const ERROR_CODE_NO_DATA_FOUND = 404;
const ERROR_CODE_SERVER_ERROR = 500;
const ERROR_CODE_UNAUTHORIZED = 401;
const ERROR_CODE_VALIDATION_ERROR = 400;

const INCORRECT_DATA = 'Некорректные данные';
const EMAIL_EXIST = 'Пользователь с таким email уже существует';
const SERVER_ERROR = 'Произошла ошибка';
const WRONG_EMAIL_OR_PASSWORD = 'Неправильные почта или пароль';
const NO_SAVED_MOVIES = 'У вас нет сохраненных фильмов';
const INVALID_ID = 'Невалидный id'
const MOVIE_NOT_FOUND = 'Фильм с таким id не найден'
const USER_NOT_FOUND = 'Пользователь с таким id не найден';
const AUTHORIZATION_REQUIRED = 'Необходима авторизация';

module.exports = {
  ERROR_CODE_CONFLICT,
  ERROR_CODE_FORBIDDEN,
  ERROR_CODE_NO_DATA_FOUND,
  ERROR_CODE_SERVER_ERROR,
  ERROR_CODE_UNAUTHORIZED,
  ERROR_CODE_VALIDATION_ERROR,
  INCORRECT_DATA,
  EMAIL_EXIST,
  SERVER_ERROR,
  WRONG_EMAIL_OR_PASSWORD,
  NO_SAVED_MOVIES,
  INVALID_ID,
  MOVIE_NOT_FOUND,
  USER_NOT_FOUND,
  AUTHORIZATION_REQUIRED
}