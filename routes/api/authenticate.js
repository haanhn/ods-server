const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const authenticateController = require('../../controllers/authenticateController');

const router = express.Router();


router.post('/getOTP', authenticateController.getOTP);

router.post('/register', authenticateController.register);

router.post('/signin', authenticateController.login);

router.post('/reset-password', authenticateController.resetPassword);

router.post('/new-password', authenticateController.newPassword);

// router.use(AuthMiddleware.isAuth);

router.post('/logout', authenticateController.logout);


module.exports = router;