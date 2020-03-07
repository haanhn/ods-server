const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const donationController = require('../../controllers/donationController');

const router = express.Router();

/*
Lay tat ca donation của campaign hien co
Response: donation list gồm donation và donor
*/
router.get('/get-by-campaign/:campaignSlug', donationController.getAllByCampaign);

router.post('/create', donationController.create);

//Nhung api ben duoi bat buoc phai authen
router.use(AuthMiddleware.isAuth);

router.get('/host/get-by-campaign/:campaignSlug', donationController.hostGetAll);

// router.get('/host/:donationId', donationController.hostShow);

// router.post('/host/create', donationController.hostCreate);

// router.patch('/host/update', donationController.hostUpdate);



module.exports = router;