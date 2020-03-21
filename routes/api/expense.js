const express = require('express');

const AuthMiddleware = require('../../middleware/AuthMiddleware');
const expenseController = require('../../controllers/expenseController');

const router = express.Router();

router.get('/:campaignSlug', expenseController.getAll);

router.use(AuthMiddleware.isAuth);

router.post('/', expenseController.create);

router.post('/update', expenseController.update);

router.delete('/:expenseId', expenseController.destroy)

module.exports = router;