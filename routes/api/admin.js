const express = require('express');

const category = require('../../controllers/category');

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

module.exports = router;