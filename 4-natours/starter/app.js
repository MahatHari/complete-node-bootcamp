const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// MIDDLEWARES
//third party middle ware => morgan to log
app.use(morgan('dev'));

// custom middle ware
app.use((req, res, next) => {
  console.log('Hello from the middleware :');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//RUN SERVER
const port = 8000;
app.listen(port, () => {
  console.log('Listening to port ', port);
});
