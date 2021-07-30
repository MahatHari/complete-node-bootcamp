const fs = require('fs');
// Reading Data, on top level
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

//check id middle ware function
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  const { id } = req.params;
  if (id > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

// Route Handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  //checkId took care of following code
  const { id } = req.params;

  const tour = tours.find((el) => el.id === Number(id));

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.updateTour = (req, res) => {
  /* const { id } = req.params;
  if (id > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    }); */
  res.status(200).json({
    status: 'success',
    data: {
      tour: req.body,
    },
  });
};
exports.createTour = (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tours: newTour,
        },
      });
    }
  );
};
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
