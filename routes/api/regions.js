const express = require('express');

const regionController = require('../../controllers/regionController');

const router = express.Router();

router.get('/', regionController.getAll);

module.exports = router;