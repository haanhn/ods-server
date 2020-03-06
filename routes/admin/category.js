const express = require('express');

const categoryController = require('../../controllers/admin/categoryController');


const router = express.Router();


router.get('/',  categoryController.index);

router.get('/create',  categoryController.create);

router.post('/create', categoryController.store);

router.get('/edit/:categorySlug', categoryController.edit);

router.post('/edit/:categorySlug', categoryController.update);

router.get('/delete/:categorySlug', categoryController.delete);

module.exports = router;