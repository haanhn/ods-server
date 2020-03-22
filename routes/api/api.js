const express = require('express');
const app = express();

const authenRoutes = require('./authenticate');
const campaignRoutes = require('./campaign');
const categoryRoutes = require('./category');
const userRoutes = require('./user');
const regionRoutes = require('./regions');
const bankAccountRoutes = require('./bankAccount');
const commentRoutes = require('./comment');
const uploadRoutes = require('./upload');
const donationRoutes = require('./donation');
const postRoutes = require('./post');
const expense = require('./expense');
const campaignReview = require('./campaignReview');

const router = express.Router();

router.use('/', authenRoutes);

router.use('/regions', regionRoutes);

router.use('/bank-account', bankAccountRoutes);

router.use('/campaign', campaignRoutes);

router.use('/categories', categoryRoutes);

router.use('/user', userRoutes);

router.use('/comments', commentRoutes);

router.use('/uploads', uploadRoutes);

router.use('/donations', donationRoutes);

router.use('/posts', postRoutes);

router.use('/expenses', expense);

router.use('/campaignReviews', campaignReview);

module.exports = router;