const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBookById);
router.post('/', booksController.createBook);
router.put('/:id', booksController.updateBook);
router.get('/:id/quantite', booksController.getQuantite);
router.put('/:id/quantite', booksController.updateQuantite);
router.delete('/:id', booksController.deleteLivre);


module.exports = router;