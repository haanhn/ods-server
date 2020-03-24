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

router.post('/paypal', donationController.createPayment);

router.get('/paypal/success', donationController.executePayment);

// router.get('/paypal/cancel', donationController.cancelPayment);

router.post('/host/update-donation-status-via-email/:action', donationController.hostUpdateDonationStatusViaEmail);


//Nhung api ben duoi bat buoc phai authen
router.use(AuthMiddleware.isAuth);

router.get('/', donationController.getAllByUser);

router.get('/host/get-by-campaign/:campaignSlug', donationController.hostGetAll);

router.post('/host/update-donation-status/:action', donationController.hostUpdateDonationStatus);

// router.get('/host/:donationId', donationController.hostShow);

// router.post('/host/create', donationController.hostCreate);

// router.patch('/host/update', donationController.hostUpdate);



module.exports = router;