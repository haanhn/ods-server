const express = require('express');

const category = require('../../controllers/admin/category');

const campaignRoutes = require('./campaign');
const userRoutes = require('./user');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    pageTitle: 'Admin Dashboard',
    path: '/admin'
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
router.use('/campaigns', campaignRoutes);

//user routes
router.use('/users', userRoutes);

module.exports = router;
