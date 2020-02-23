const express = require('express');

const frontEnd = require('../../controllers/frontEndController');

const router = express.Router();
 const cors = require('cors');

router.get('/categories', frontEnd.getAvailableCategories);

//campaigns
router.get('/campaigns', frontEnd.getAvailableCampaigns);
router.post('/campaigns', cors(), frontEnd.createCampaign);

router.put('/user/update-address', frontEnd.updateUserAddress);
router.post('/user/bank-account', frontEnd.setBankAccount);
router.post('/user/get-info', frontEnd.getUserInfo);

module.exports = router;