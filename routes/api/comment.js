const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const commentController = require('../../controllers/commentController');

const router = express.Router();

router.get('/:campaignSlug', commentController.getAll);

router.use(AuthMiddleware.isAuth);

router.post('/', commentController.create);

router.delete('/:commentId', commentController.destroy)

module.exports = router;