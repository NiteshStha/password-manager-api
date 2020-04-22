const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authorization');

const EmailController = require('../controllers/email');

router.route('/').get(auth, EmailController.emails_get_emails);
router.route('/:id').get(auth, EmailController.emails_get_email);
router.route('/').post(auth, EmailController.emails_create_email);
router.route('/:id').put(auth, EmailController.emails_update_email);
router.route('/:id').delete(auth, EmailController.emails_delete_email);

module.exports = router;
