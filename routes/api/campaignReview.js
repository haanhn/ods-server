const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const campaignReviewController = require('../../controllers/campaignReviewController');

const router = express.Router();

router.get('/:campaignSlug', campaignReviewController.getAll);

router.get('/overall/:campaignSlug', campaignReviewController.getOverall);

router.use(AuthMiddleware.isAuth);

router.post('/check-allow/:campaignSlug', campaignReviewController.checkAllow);

router.post('/', campaignReviewController.create);

router.delete('/:reviewId', campaignReviewController.destroy)

module.exports = router;