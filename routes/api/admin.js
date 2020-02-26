const express = require('express');

const category = require('../../controllers/categoryController');
const role = require('../../controllers/roleController');
const campaign = require('../../controllers/campaignController');

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

router.get('/categories/delete/:id', category.delete);

//role router

router.get('/roles', role.index);

router.get('/roles/create', role.create);

router.post('/roles', role.store);

router.get('/roles/edit/:id', role.edit);

router.post('/roles/edit', role.update);

router.get('/roles/delete/:id', role.delete);

//Campaign router
router.get('/campaigns', campaign.index);

router.get('/campaigns/create', campaign.create);

router.post('/campaigns', campaign.store);

router.get('/campaigns/edit/:id', campaign.edit);

router.post('/campaigns/edit', campaign.update);

router.get('/campaigns/delete/:id', campaign.delete);

module.exports = router;