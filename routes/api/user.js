const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const userController = require('../../controllers/userController');

const router = express.Router();

router.use(AuthMiddleware.isAuth);

router.post('/', userController.getUser);

router.post('/update-address', userController.updateAddress);

router.post('/bank-account', userController.createBankAccount);

// router.post('/create-step3', campaignController.createCampaignStep3);

module.exports = router;