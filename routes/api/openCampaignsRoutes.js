const express = require('express');

const categoriesController = require('../../controllers/category');

const router = express.Router();

router.get('/categories', categoriesController.getOpenCategories);

module.exports = router;
