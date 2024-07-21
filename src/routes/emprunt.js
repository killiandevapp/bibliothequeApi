const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');

router.post('/', empruntController.postEmprunt);
router.put('/:id', empruntController.updateEmprunt);

module.exports = router;