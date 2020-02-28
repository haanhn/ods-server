const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const bankAccountController = require('../../controllers/bankAccountController');

const router = express.Router();

router.get('/', bankAccountController.findAll);

router.use(AuthMiddleware.isAuth);

router.post('/', bankAccountController.find);

router.post('/create', bankAccountController.create);

router.patch('/', bankAccountController.update);

router.delete('/', bankAccountController.delete);

module.exports = router;