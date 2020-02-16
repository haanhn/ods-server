const express = require('express');

const category = require('../../controllers/category');

const router = express.Router();

//Category routes

router.get('/categories', category.index);

router.post('/categories', category.store);

router.get('/categories/:categoryId', category.show);

router.post('/categories/edit', category.update);

router.post('/categories/delete', category.delete);
module.exports = router;