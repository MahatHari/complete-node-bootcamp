const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xxs = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//1. Global MIDDLEWARES

//Set security HTTP Headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// express rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from body into req.body => maximum size 10kb
app.use(express.json({ limit: '10kb' }));

// Data sanitization agains NoSQL query injection
app.use(mongoSanitize());
// Data sanitization agains XSS
app.use(xxs());

// Prevent parameter pollution, passed object to white list, to duplicate in parameter
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'duration',
      'ratingAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//Serving static files
app.use(express.static(`${__dirname}/public`));

//Custom Test middle ware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers)
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
