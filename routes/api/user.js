const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const userController = require('../../controllers/userController');

const router = express.Router();

router.get('/get-user/:id', userController.getUserById);

router.use(AuthMiddleware.isAuth);

router.post('/', userController.getUserByEmail);

router.post('/update-address', userController.updateAddress);

router.post('/update-paypal', userController.updatePaypal);


module.exports = router;