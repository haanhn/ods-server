const express = require('express');

const campaignController = require('../../controllers/admin/campaignController');


const router = express.Router();


router.get('/', campaignController.index);

router.get('/:status', campaignController.getByStatus);

module.exports = router;