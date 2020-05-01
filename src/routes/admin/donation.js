const express = require('express');

const donationController = require('../../controllers/admin/donationController');


const router = express.Router();


router.get('/', donationController.index);

router.get('/:status', donationController.getByStatus);

router.get('/details/:donationId', donationController.show);

router.get('/reject/:donationId', donationController.rejectDonation);

router.get('/approve/:donationId', donationController.getApproveDonation);

router.post('/approve', donationController.postApproveDonation);
module.exports = router;