const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const errHandler = require('./middlewares/errHandler');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const authRouter = require('./routes/auth');
const auth = require('./middlewares/auth');
const NoDataFound = require('./errors/NoDataFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');

require('dotenv').config();

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

app.use(requestLogger);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

app.use(helmet());

app.use(bodyParser.json());

app.use('/', authRouter);

app.use(auth);

app.use('/', userRouter);
app.use('/', movieRouter);

app.use((req, res, next) => next(new NoDataFound('Неправильный маршрут')));

app.use(errorLogger);

app.use(errors());

app.use(errHandler);

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.listen(PORT);
