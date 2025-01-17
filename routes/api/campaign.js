const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const campaignController = require('../../controllers/campaignController');

const router = express.Router();

/*
Lay tat ca campaign hien co
Response: campaigns list
*/
router.get('/get-all', campaignController.getAll);

router.get('/get-by-user/:userId', campaignController.getByUser);

//Get recommendated campaigns
router.get('/get-similar-by-campaign/:campaignSlug', campaignController.getCampaignsByWeightSumPoint);
router.get('/get-by-similar-users/:userId', campaignController.getCampaignsBySimilarUsers);

/*
Lay tat ca campaign theo category da public
Param:category slug
Response: campaigns list
*/
router.get('/get-by-category/:categorySlug', campaignController.getAllByCategory);
router.get('/search-campaigns', campaignController.searchCampaigns);
router.get('/get-public-campaigns', campaignController.getAllPublicCampaigns);

/*
lay so luong nhat dinh (amount) campaign moi nhat da public
Param:amount campaign
Response: list campaign
*/
router.get('/get-by-newest/:amount', campaignController.getNewest);

/*
Lay tat ca thong tin co ban + category + host cua campaign da public va theo campaign slug
Param:campaign slug
Response: campaign
*/
router.get('/get-detail/:campaignSlug', campaignController.getCampaignDetail);

//Nhung api ben duoi bat buoc phai authen
router.use(AuthMiddleware.isAuth);

router.get('/:campaignSlug', campaignController.hostGetCampaignDetails);
router.get('/host-get-stats/:campaignSlug', campaignController.hostGetCampaignStats);

/*
lay ra tat ca nhung campaign ma minh da host hoac follow
Param:relation(host/follow)
Response: list campaign
*/
router.get('/get-by-relation/:relation', campaignController.getByRelation);

router.post('/check-before-create', campaignController.checkBeforeCreateCampaign);

router.post('/create', campaignController.createCampaign);

router.post('/create-step2', campaignController.createCampaignStep2);

router.post('/create-step3', campaignController.createCampaignStep3);

router.post('/create-step5', campaignController.createCampaignStep5);

router.post('/update', campaignController.update);

router.post('/update/status', campaignController.updateStatus);


module.exports = router;