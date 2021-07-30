const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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

// Reading Data, on top level
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
);

// Route Handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((el) => el.id === Number(id));
  //if (id > tours.length)
  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
const updateTour = (req, res) => {
  const { id } = req.params;
  if (id > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  res.status(200).json({
    status: 'success',
    data: {
      tour: req.body,
    },
  });
};
const createTour = (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tours: newTour,
        },
      });
    }
  );
};
const deleteTour = (req, res) => {
  const { id } = req.params;
  if (id > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route no implemented yet',
  });
};
//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTour);
//app.post('/api/v1/tours', createTour);
//app.patch('/api/v1/tours/:id', updateTour);
//app.delete('/api/v1/tours/:id', deleteTour);

//ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

//RUN SERVER
const port = 8000;
app.listen(port, () => {
  console.log('Listening to port ', port);
});
