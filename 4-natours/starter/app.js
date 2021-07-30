const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//1. MIDDLEWARES
app.use(express.json());
//third party middle ware => morgan to log
app.use(morgan('dev'));

//2.custom middle ware
app.use((req, res, next) => {
  console.log('Hello from the middleware :');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3.ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//4.RUN SERVER
const port = 8000;
app.listen(port, () => {
  console.log('Listening to port ', port);
});
