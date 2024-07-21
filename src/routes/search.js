const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');


router.get('/:mots', searchController.searchBook);

module.exports = router;