const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
//1. MIDDLEWARES
app.use(express.json());
//third party middle ware => morgan to log
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3.ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//NOT FOUND Routes
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `cant find ${req.originalUrl} on this server`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
