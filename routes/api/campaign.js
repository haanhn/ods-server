const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const campaignController = require('../../controllers/campaignController');

const router = express.Router();

router.use(AuthMiddleware.isAuth);

router.post('/create', campaignController.createCampaign);

router.post('/create-step2', campaignController.createCampaignStep2);

router.post('/create-step3', campaignController.createCampaignStep3);

module.exports = router;