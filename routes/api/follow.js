const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const followController = require('../../controllers/followController');

const router = express.Router();

router.post('/', followController.follow);

// router.post('/unfollow', followController.unFollow);

router.use(AuthMiddleware.isAuth);

router.get('/check/:campaignId', followController.checkFollowing);

module.exports = router;