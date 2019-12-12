const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

router.post('/forgetPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addNewUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
