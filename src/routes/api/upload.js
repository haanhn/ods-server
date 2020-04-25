const express = require('express');

const uploadController = require('../../controllers/uploadController');
const AuthMiddleware = require('../../middleware/AuthMiddleware');
const upload = require('../../config/multer');


const router = express.Router();

router.post('/', upload.single('image'), uploadController.uploadSingle);

router.use(AuthMiddleware.isAuth);

router.post('/campaign/:campaignSlug', upload.single('image'), uploadController.uploadCampaignImage);


module.exports = router;