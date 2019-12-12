const express = require('express');
const authControllers = require('../controllers/authControllers');

const router = express.Router();
const tourControllers = require('../controllers/tourControllers');

// router.param('id', tourControllers.checkId);

router
  .route('/top5tours')
  .get(tourControllers.getTopTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

router
  .route('/')
  .get(authControllers.protect, tourControllers.getAllTours)
  .post(tourControllers.addNewTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

module.exports = router;
