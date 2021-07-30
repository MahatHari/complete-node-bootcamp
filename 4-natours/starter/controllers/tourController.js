const fs = require('fs');
// Reading Data, on top level
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

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
exports.updateTour = (req, res) => {
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
exports.createTour = (req, res) => {
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
exports.deleteTour = (req, res) => {
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
