const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const postController = require('../../controllers/postController');

const router = express.Router();

router.get('/get-all-post/:campaignSlug', postController.getAll);


router.use(AuthMiddleware.isAuth);

router.get('/host/get-all-post/:campaignSlug', postController.hostGetAll);

router.post('/host/create', postController.create);

router.post('/host/update', postController.update);




module.exports = router;