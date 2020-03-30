const express = require('express');

const campaignRoutes = require('./campaign');
const userRoutes = require('./user');
const categoryRoutes = require('./category');
const roleRoutes = require('./role');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    pageTitle: 'Admin Dashboard',
    path: '/admin'
  });
});

//Category routes
router.use('/categories', categoryRoutes);

//Campaign routes
router.use('/campaigns', campaignRoutes);

//user routes
router.use('/users', userRoutes);

//role routes
router.use('/roles', roleRoutes);

module.exports = router;
