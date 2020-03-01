const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const commentController = require('../../controllers/commentController');

const router = express.Router();

router.use(AuthMiddleware.isAuth);

router.post('/', commentController.create);

module.exports = router;