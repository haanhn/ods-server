const express = require('express');

const authenticateController = require('../../controllers/authenticateController');

const router = express.Router();


router.post('/getOTP', authenticateController.sendOTP);

router.post('/register', authenticateController.register);

router.post('/signin', authenticateController.login);

module.exports = router;