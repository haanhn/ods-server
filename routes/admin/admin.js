const express = require('express');

const AdminMiddleware = require('../../middleware/AdminMiddleware');
const campaignRoutes = require('./campaign');
const userRoutes = require('./user');
const categoryRoutes = require('./category');
const roleRoutes = require('./role');
const adminController = require('../../controllers/admin/adminController');

const router = express.Router();

router.get('/login', adminController.login);

router.post('/login', adminController.postLogin);

router.get('/logout', adminController.logout);

router.use(AdminMiddleware.isAdmin);

router.get('/', (req, res, next) => {
  res.render('index', {
    pageTitle: 'Admin Dashboard',
    path: '/admin', 
    admin: req.user
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
