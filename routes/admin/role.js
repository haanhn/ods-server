const express = require('express');

const roleController = require('../../controllers/admin/roleController');


const router = express.Router();


router.get('/',  roleController.index);

router.get('/create',  roleController.create);

router.post('/create', roleController.store);

router.get('/edit/:roleId', roleController.edit);

router.post('/edit', roleController.update);

router.get('/delete/:roleId', roleController.delete);

module.exports = router;