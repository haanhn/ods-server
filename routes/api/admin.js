const express = require('express');

const category = require('../../controllers/category');

const campaign = require('../../controllers/campaignController');

const listcampaign = require('../../controllers/listcampaignController');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    pageTitle: 'Admin Dashboard'
  });
});

//Category routes

router.get('/categories', category.index);

// router.get('/categories/:categoryId', category.show);

router.get('/categories/create', category.create);

router.post('/categories', category.store);

router.get('/categories/edit/:categorySlug', category.edit);

router.post('/categories/edit', category.update);

router.post('/categories/delete', category.delete);

//Campaign routes
router.get('/campaigns', campaign.index);

//List Campaign routes
router.get('/listcampaigns', listcampaign.index);
router.get('/listcampaigns/create', listcampaign.create);
// router.get('/campaigns/list', (req, res, next) => {
//   res.send('abc');
//   next();
// });
// router.get('/campaigns/list-by-status/:status', (req, res, next) => {
//   res.send('abc' + req.params.status);
//   next();
// });

router.get('/listcampaigns/list-by-status/:status', listcampaign.getByStatus);

module.exports = router;
