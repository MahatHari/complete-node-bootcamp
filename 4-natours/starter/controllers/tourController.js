const Tour = require('../models/tourModel');

/* // Reading Data, on top level
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
); */

/* //check id middle ware function
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  const { id } = req.params;
  /* if (id > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    }); 
  next();
}; */

/* exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
}; */

// Route Handlers
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.send(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); //Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.send(404).json({
      status: 'fail',
      message: err,
    });
  }
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
exports.createTour = async (req, res) => {
  //const newTour= new Tour({})
  // newTour.save() method returns promise
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
