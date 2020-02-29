const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const campaignController = require('../../controllers/campaignController');

const router = express.Router();

router.get('/', campaignController.getAll);

router.get('/:campaignSlug', campaignController.getCampaignDetail);

router.get('/get-all-by-category/:categorySlug', campaignController.getAllByCategory);

router.use(AuthMiddleware.isAuth);

router.post('/create', campaignController.createCampaign);

router.post('/create-step2', campaignController.createCampaignStep2);

router.post('/create-step3', campaignController.createCampaignStep3);

module.exports = router;