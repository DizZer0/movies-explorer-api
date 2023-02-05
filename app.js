require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const errHandler = require('./middlewares/errHandler');
const NoDataFound = require('./errors/NoDataFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter, moviesdb } = require('./utils/config')

const corsOptions = {
  origin: 'http://dizzero.diplom.nomoredomainsclub.ru',
  optionsSuccessStatus: 200,
};

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors(corsOptions));

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());

app.use(require('./routes/index'))

app.use((req, res, next) => next(new NoDataFound('Неправильный маршрут')));

app.use(errorLogger);

app.use(errors());

app.use(errHandler);

mongoose.connect(moviesdb);

app.listen(PORT);
