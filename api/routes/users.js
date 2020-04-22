const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authorization');

const UserController = require('../controllers/user');

router.route('/signup').post(UserController.users_signup);
router.route('/login').post(UserController.users_login);
router.route('/:id').delete(auth, UserController.users_delete_user);

module.exports = router;
