const express = require('express');
const app = express();

const authenRoutes = require('./authenticate');
const campaignRoutes = require('./campaign');
const categoryRoutes = require('./category');
const userRoutes = require('./user');
const regionRoutes = require('./regions');
const bankAccountRoutes = require('./bankAccount');

const router = express.Router();

router.use('/', authenRoutes);

router.use('/regions', regionRoutes);

router.use('/bank-account', bankAccountRoutes);

router.use('/campaign', campaignRoutes);

router.use('/categories', categoryRoutes);

router.use('/user', userRoutes);

module.exports = router;