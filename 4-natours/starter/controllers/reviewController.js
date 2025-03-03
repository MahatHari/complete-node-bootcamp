const AppError = require('../utils/appError');
const Review = require('../models/reviewModel');
//const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

//Route handlers

// exports.getAllReviews = catchAsync(
//   async (req, res, next) => {
//     let filter = {};
//     if (req.params.tourId) {
//       filter = {
//         tour: req.params.tourId,
//       };
//     }
//     const reviews = await Review.find(filter);
//     res.status(200).json({
//       status: 'sucess',
//       results: reviews.length,
//       data: {
//         reviews,
//       },
//     });
//   }
// );

//Get review for particular tour
/* exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.find({
    tour: req.params.tourId,
  });

  if (!review) {
    next(new AppError('No reivew by that id', 404));
  }
  res.status(200).json({
    status: 'success',

    data: {
      review,
    },
  });
}); */

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

/* catchAsync(
  async (req, res, next) => {
    //ALLOW nested routess
    
    const newReview = await Review.create(req.body);
    res.status(201).json({
      status: 'sucess',
      data: {
        review: newReview,
      },
    });
  }
); */

exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getOne = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);
