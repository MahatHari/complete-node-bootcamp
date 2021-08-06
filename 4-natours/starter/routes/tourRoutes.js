const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

//router.param('id', tourController.checkID);

//create a checkbody middleware
// check if body contains the name and price property
//if not send back 400 (bad request)
// add it to the post handler stack
// tourController.checkBody middleware inside .post

//mounting review router on tour router
router.use('/:tourId/reviews', reviewRouter);

//Creating Popular route
router
  .route('/top-5-cheap')
  .get(
    tourController.aliasTopTours,
    tourController.getAllTours
  );
//Creating stats route
router
  .route('/tour-stats')
  .get(tourController.getTourStats);
//Busy time of year
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo(
      'admin',
      'lead-guide',
      'guide'
    ),
    tourController.getMonthlyPlan
  );

//basic routes
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );
//Nested Route, to create reviews on Tour route
/* router
  .route('/:tourId/reviews')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.getReview
  )
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  ); */

module.exports = router;
