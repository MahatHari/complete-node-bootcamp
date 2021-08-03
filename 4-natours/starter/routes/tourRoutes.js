const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

//router.param('id', tourController.checkID);

//create a checkbody middleware
// check if body contains the name and price property
//if not send back 400 (bad request)
// add it to the post handler stack
// tourController.checkBody middleware inside .post

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
  .get(tourController.getMonthlyPlan);

//basic routes
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
