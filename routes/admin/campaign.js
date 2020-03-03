const express = require('express');

const campaignController = require('../../controllers/admin/campaignController');


const router = express.Router();


router.get('/', campaignController.index);

router.get('/:status', campaignController.getByStatus);

router.get('/details/:campaignSlug', campaignController.show);

router.post('/action/:action', campaignController.campaignAction);

module.exports = router;