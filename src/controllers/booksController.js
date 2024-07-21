// const booksService = require('../services/booksService');

// exports.getAllBooks = async (req, res, next) => {
//     try {
//         const books = await booksService.getAllBooks();
//         res.json(books);
//     } catch (error) {
//         next(error);
//     }
// };

// exports.getBookById = async (req, res, next) => {
//     try {
//         const book = await booksService.getBookById(req.params.id);
//         if (!book) {
//             return res.status(404).json({ message: 'Book not found' });
//         }
//         res.json(book);
//     } catch (error) {
//         next(error);
//     }
// };

// exports.getQuantite = async (req, res, next) => {
//     try {
//         const quantites = await booksService.getQuantite(req.params.id);
//         res.status(200).json(quantites);
//     } catch (error) {
//         console.error('Erreur lors de la récupération des quantités:', error.message);
//         res.status(400).json({ message: error.message });
//     }
// };


// exports.updateQuantite = async (req, res, next) => {
//     try {
//         await booksService.updateQuantite(req.params.id, req.body.quantite);
//         res.status(200).json({ message: 'Quantité mise à jour avec succès' });
//     } catch (error) {
//         console.error('Erreur lors de la mise à jour des quantités:', error.message);
//         res.status(400).json({ message: error.message });
//     }
// };

// exports.deleteLivre = async (req, res, next) => {
//     try {
//         await booksService.deleteLivre(req.params.id);
//         res.status(200).json({ message: 'Livre supprimé avec succès' });
//     } catch (error) {
//         console.error('Erreur lors de la suppression du livre:', error.message);
//         res.status(400).json({ message: error.message });
//     }
// };



// // exports.getQuantite = async (req, res, next) =>{

// //     const book = await booksService.getBookById(req.params.id);


// // }

// // exports.createBook = async (req, res, next) => {
// //     try {
// //         const newBook = await booksService.createBook(req.body);
// //         res.status(201).json(newBook);
// //     } catch (error) {
// //         // console.error('Erreur lors de la création du livre:', error.message);
// //         if (error.message.startsWith('Auteur non trouvé')) {
// //             return res.status(400).json({ message: error.message });
// //         } else if (error.message === 'Données du livre invalides') {
// //             return res.status(400).json({ message: error.message });
// //         }
// //         res.status(500).json({ message: "Une erreur est survenu lors de la création du livre" });
// //     }
// // };
// exports.createBook = async (req, res, next) => {
//     try {
//         console.log('Requête reçue pour créer un livre avec les données:', req.body);
//         const newBook = await booksService.createBook(req.body);
//         res.status(201).json(newBook);
//     } catch (error) {
//         console.error('Erreur lors de la création du livre:', error.message);
//         if (error.message.startsWith('Auteur non trouvé')) {
//             return res.status(400).json({ message: error.message });
//         } else if (error.message === 'Données du livre invalides') {
//             return res.status(400).json({ message: error.message });
//         }
//         res.status(500).json({ message: "Une erreur est survenue lors de la création du livre" });
//     }
// };
// exports.updateBook = async (req, res, next) => {
//     try {
//         const bookId = req.params.id;
//         console.log(bookId);
//         const updatedBook = await booksService.updateBook(bookId, req.body);
//         res.json(updatedBook);
//     } catch (error) {
//         if (error.message.includes("L'auteur avec l'ID")) {
//             return res.status(400).json({ message: error.message });
//         }
//         next(error);
//     }
// };

const booksService = require('../services/booksService');
const { generateETag } = require('../utils');

exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await booksService.getAllBooks();
        res.json(books);
    } catch (error) {
        next(error);
    }
};

exports.getQuantite = async (req, res, next) => {
    try {
        const quantites = await booksService.getQuantite(req.params.id);
        res.status(200).json(quantites);
    } catch (error) {
        console.error('Erreur lors de la récupération des quantités:', error.message);
        res.status(400).json({ message: error.message });
    }
};


exports.updateQuantite = async (req, res, next) => {
    try {
        await booksService.updateQuantite(req.params.id, req.body.quantite);
        res.status(200).json({ message: 'Quantité mise à jour avec succes' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des quantités:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.getBookById = async (req, res, next) => {
    try {
        const book = await booksService.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        const etag = generateETag(JSON.stringify(book));
        res.setHeader('ETag', etag);
        res.json({ ...book, etag });
    } catch (error) {
        next(error);
    }
};

exports.createBook = async (req, res, next) => {
    try {
        const newBook = await booksService.createBook(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        if (error.message.startsWith('Auteur non trouvé')) {
            return res.status(400).json({ message: error.message });
        } else if (error.message === 'Données du livre invalides') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Une erreur est survenue lors de la création du livre" });
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const currentBook = await booksService.getBookById(bookId);

        if (!currentBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const clientETag = req.headers['if-match'];
        const serverETag = generateETag(JSON.stringify(currentBook));

        if (clientETag !== serverETag) {
            return res.status(412).json({ message: 'ETag does not match, concurrent modification detected' });
        }

        const updatedBook = await booksService.updateBook(bookId, req.body);
        res.json(updatedBook);
    } catch (error) {
        if (error.message.includes("L'auteur avec l'ID")) {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
};

exports.deleteLivre = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const currentBook = await booksService.getBookById(bookId);

        if (!currentBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const clientETag = req.headers['if-match'];
        const serverETag = generateETag(JSON.stringify(currentBook));

        if (clientETag !== serverETag) {
            return res.status(412).json({ message: 'ETag does not match, concurrent modification detected' });
        }

        await booksService.deleteLivre(bookId);
        res.status(200).json({ message: 'Livre supprimé avec succès' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
