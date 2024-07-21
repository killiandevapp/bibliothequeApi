// const booksRepository = require('../repository/booksRepository');
// const authorsRepository = require('../repository/authorsRepository');
// const empruntsRepository = require('../repository/empruntsRepository');

// class BooksService {
//     async getAllBooks() {
//         return await booksRepository.getAllBooks();
//     }

//     async getBookById(id) {
//         return await booksRepository.getBookAndAuteurs(id);
//     }



//     async createBook(bookData) {
//         console.log('Début de createBook avec les données:', bookData);

//         if (!bookData.titre || !Array.isArray(bookData.auteurs)) {
//             throw new Error('Données du livre invalides');
//         }

//         // Vérifiez si les auteurs existent
//         for (let authorId of bookData.auteurs) {
//             console.log('Vérification de l\'auteur avec ID:', authorId);
//             try {
//                 const authorExists = await authorsRepository.authorExists(authorId);
//                 if (!authorExists) {
//                     console.log(`Auteur non trouvé: l'ID ${authorId} n'existe pas`);
//                     throw new Error(`Auteur non trouvé: l'ID ${authorId} n'existe pas`);
//                 }
//             } catch (error) {
//                 console.error('Erreur lors de la vérification de l\'auteur:', error.message);
//                 throw new Error(`Auteur non trouvé: l'ID ${authorId} n'existe pas`);
//             }
//         }

//         if (!bookData.quantite) bookData.quantite = 1;

//         console.log('Tous les auteurs vérifiés, création du livre');
//         return await booksRepository.createBook(bookData);
//     }

//     async updateBook(bookId, bookData) {
//         const { titre, annee_publication, auteurs } = bookData;

//         // Vérifier l'existence des auteurs
//         if (auteurs) {
//             for (let auteurId of auteurs) {
//                 const authorExists = await authorsRepository.authorExists(auteurId);
//                 if (!authorExists) {
//                     throw new Error(`L'auteur avec l'ID ${auteurId} n'existe pas.`);
//                 }
//             }
//         }

//         // Mettre à jour les informations du livre
//         await booksRepository.updateBook(bookId, { titre, annee_publication });

//         // Mettre à jour les relations auteur-livre si des auteurs sont fournis
//         if (auteurs) {
//             await booksRepository.updateBookAuthors(bookId, auteurs);
//         }

//         // Récupérer et retourner le livre mis à jour
//         return await booksRepository.getBookAndAuteurs(bookId);
//     }

//     async getQuantite(id) {
//         const livre = await booksRepository.getBookById(id);
//         if (!livre) {
//             throw new Error('Livre non trouvé');
//         }

//         const nombreEmpruntsEnCours = await empruntsRepository.countEmpruntsEnCours(id);
//         const quantiteDisponible = livre.quantite - nombreEmpruntsEnCours;

//         return {
//             quantiteTotale: livre.quantite,
//             quantiteDisponible
//         };
//     }



//     async updateQuantite(id, nouvelleQuantite) {
//         const nombreEmpruntsEnCours = await empruntsRepository.countEmpruntsEnCours(id);

//         if (nouvelleQuantite < nombreEmpruntsEnCours) {
//             throw new Error('La nouvelle quantité est inférieure au nombre d\'emprunts en cours');
//         }

//         await booksRepository.updateBookQuantity(id, nouvelleQuantite);
//     }

//     async deleteLivre(id) {
//         const nombreEmpruntsEnCours = await empruntsRepository.countEmpruntsEnCours(id);

//         if (nombreEmpruntsEnCours > 0) {
//             throw new Error('Impossible de supprimer le livre car des emprunts sont en cours');
//         }

//         await booksRepository.deleteBook(id);
//     }



// }

// module.exports = new BooksService();

const booksRepository = require('../repository/booksRepository');
const authorsRepository = require('../repository/authorsRepository');
const empruntsRepository = require('../repository/empruntsRepository');

class BooksService {
    async getAllBooks() {
        return await booksRepository.getAllBooks();
    }

    async getBookById(id) {
        return await booksRepository.getBookAndAuteurs(id);
    }

    async createBook(bookData) {
        if (!bookData.titre || !Array.isArray(bookData.auteurs)) {
            throw new Error('Données du livre invalides');
        }

        for (let authorId of bookData.auteurs) {
            const authorExists = await authorsRepository.authorExists(authorId);
            if (!authorExists) {
                throw new Error(`Auteur non trouvé: l'ID ${authorId} n'existe pas`);
            }
        }

        if (!bookData.quantite) bookData.quantite = 1;

        return await booksRepository.createBook(bookData);
    }
    
    async updateQuantite(id, nouvelleQuantite) {
        const nombreEmpruntsEnCours = await empruntsRepository.countEmpruntsEnCours(id);

        if (nouvelleQuantite < nombreEmpruntsEnCours) {
            throw new Error('La nouvelle quantité est inférieure au nombre d\'emprunts en cours');
        }

        await booksRepository.updateBookQuantity(id, nouvelleQuantite);
    }

    async updateBook(bookId, bookData) {
        const { titre, annee_publication, auteurs } = bookData;

        if (auteurs) {
            for (let auteurId of auteurs) {
                const authorExists = await authorsRepository.authorExists(auteurId);
                if (!authorExists) {
                    throw new Error(`L'auteur avec l'ID ${auteurId} n'existe pas.`);
                }
            }
        }

        await booksRepository.updateBook(bookId, { titre, annee_publication });

        if (auteurs) {
            await booksRepository.updateBookAuthors(bookId, auteurs);
        }

        return await booksRepository.getBookAndAuteurs(bookId);
    }
        async getQuantite(id) {
        const livre = await booksRepository.getBookById(id);
        if (!livre) {
            throw new Error('Livre non trouvé');
        }

        const nombreEmpruntsEnCours = await empruntsRepository.countEmpruntsEnCours(id);
        const quantiteDisponible = livre.quantite - nombreEmpruntsEnCours;

        return {
            quantiteTotale: livre.quantite,
            quantiteDisponible
        };
    }

    async deleteLivre(id) {
        const nombreEmpruntsEnCours = await empruntsRepository.countEmpruntsEnCours(id);

        if (nombreEmpruntsEnCours > 0) {
            throw new Error('Impossible de supprimer le livre car des emprunts sont en cours');
        }

        await booksRepository.deleteBook(id);
    }
}

module.exports = new BooksService();
