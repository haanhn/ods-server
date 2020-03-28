const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const hostReviewController = require('../../controllers/hostReviewController');

const router = express.Router();

router.get('/:hostId', hostReviewController.getAll);

router.get('/overall/:hostId', hostReviewController.getOverall);

router.use(AuthMiddleware.isAuth);

router.get('/check-allow/:hostId', hostReviewController.checkAllow);

router.post('/', hostReviewController.create);

router.delete('/:reviewId', hostReviewController.destroy)

module.exports = router;