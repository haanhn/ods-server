const express = require('express');

const authenticateController = require('../../controllers/authenticateController');

const router = express.Router();


router.post('/getOTP', authenticateController.sendOTP);

router.post('/register', authenticateController.register);

router.post('/signin', authenticateController.login);

router.post('/logout', authenticateController.logout);

router.post('/reset-password', authenticateController.resetPassword);

router.post('/new-password', authenticateController.newPassword);

module.exports = router;