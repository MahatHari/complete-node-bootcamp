const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(
    (el) => el.message
  );

  const message = `Invalid input data. ${errors.join(
    '. '
  )}`;
  return new AppError(message, 400);
};
const handleJsonWebTokenError = () =>
  new AppError('Invalid token please login again', 401);
const handleJWTExpiredError = () =>
  new AppError('Invalid token please login again', 401);
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    mesage: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trursted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      mesage: err.message,
    });
    // Programming or other unknow error: dont leak error details
  } else {
    // 1) Log error
    console.error('Error', err);
    // 2) Send Genereic message
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong !',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    if (error.name === 'CastError')
      error = handleCastErrorDB(error);
    if (error.code === 11000)
      error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenError(error);
    if (error.name === 'JWTExpiredError b')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};
