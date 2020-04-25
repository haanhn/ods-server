const express = require('express');

const userController = require('../../controllers/admin/userController');


const router = express.Router();


router.get('/', userController.index);

router.get('/:userId', userController.show);

router.get('/campaigns/:userId', userController.showAllCampaignHosted);


// router.get('/:status', campaignController.getByStatus);

// router.get('/details/:campaignSlug', campaignController.show);

// router.post('/action/:action', campaignController.campaignAction);

module.exports = router;