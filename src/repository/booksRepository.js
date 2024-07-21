// const db = require('../config/database');
// const Book = require('../models/book');

// class BooksRepository {

//     getBookById(id) {
//         return new Promise((resolve, reject) => {
//             db.get('SELECT * FROM livres WHERE id = ?', [id], (err, row) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(row ? new Book(row.id, row.titre, row.annee_publication, row.quantite) : null);
//                 }
//             });
//         });
//     }
//     getAllBooks() {
//         return new Promise((resolve, reject) => {
//             const query = `
//                 SELECT l.*, a.id as auteur_id, a.nom, a.prenom
//                 FROM livres l
//                 LEFT JOIN auteur_livre al ON l.id = al.id_livre
//                 LEFT JOIN auteurs a ON al.id_auteur = a.id
//             `;
//             db.all(query, [], (err, rows) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     const booksMap = new Map();
//                     rows.forEach(row => {
//                         if (!booksMap.has(row.id)) {
//                             booksMap.set(row.id, new Book(row.id, row.titre, row.annee_publication, row.quantite, []));
//                         }
//                         if (row.auteur_id) {
//                             booksMap.get(row.id).auteurs.push({
//                                 id: row.auteur_id,
//                                 nom: row.nom,
//                                 prenom: row.prenom
//                             });
//                         }
//                     });
//                     resolve(Array.from(booksMap.values()));
//                 }
//             });
//         });
//     }

//     getBookAndAuteurs(id) {
//         return new Promise((resolve, reject) => {
//             const query = `
//                 SELECT l.*, a.id as auteur_id, a.nom, a.prenom
//                 FROM livres l
//                 LEFT JOIN auteur_livre al ON l.id = al.id_livre
//                 LEFT JOIN auteurs a ON al.id_auteur = a.id
//                 WHERE l.id = ?
//             `;
//             db.all(query, [id], (err, rows) => {
//                 if (err) {
//                     reject(err);
//                 } else if (rows.length > 0) {
//                     const book = new Book(rows[0].id, rows[0].titre, rows[0].annee_publication, rows[0].quantite, []);
//                     rows.forEach(row => {
//                         if (row.auteur_id) {
//                             book.auteurs.push({
//                                 id: row.auteur_id,
//                                 nom: row.nom,
//                                 prenom: row.prenom
//                             });
//                         }
//                     });
//                     resolve(book);
//                 } else {
//                     resolve(null);
//                 }
//             });
//         });
//     }

//     createBook(bookData) {
//         return new Promise((resolve, reject) => {
//             db.run('INSERT INTO livres (titre, annee_publication, quantite) VALUES (?, ?, ?)', 
//                 [bookData.titre, bookData.annee_publication, bookData.quantite],
//                 function(err) {
//                     if (err) {
//                         console.error('Erreur lors de l\'insertion du livre:', err);
//                         reject(new Error("Impossible d'ajouter le livre a la base de donnée"));
//                     } else {
//                         const bookId = this.lastID;
//                         // Insérer les relations auteur-livre
//                         const insertAuthorPromises = bookData.auteurs.map(authorId => 
//                             new Promise((resolve, reject) => {
//                                 db.run('INSERT INTO auteur_livre (id_auteur, id_livre) VALUES (?, ?)', 
//                                     [authorId, bookId], 
//                                     err => err ? reject(err) : resolve()
//                                 );
//                             })
//                         );
    
//                         Promise.all(insertAuthorPromises)
//                             .then(() => resolve({ id: bookId, ...bookData }))
//                             .catch(err => {
//                                 console.error('Erreur lors de l\'association des auteurs:', err);
//                                 reject(new Error("Erreur lors de l'association des auteur au livre"));
//                             });
//                     }
//                 }
//             );
//         });
//     }
//     updateBook(bookId, bookData) {
//         return new Promise((resolve, reject) => {
//             const { titre, annee_publication } = bookData;

//             db.run('UPDATE livres SET titre = ?, annee_publication = ? WHERE id = ?', 
//                 [titre, annee_publication, bookId], 
//                 function(err) {
//                     if (err) return reject(err);
//                     resolve(this.changes);
//                 }
//             );
//         });
//     }

//     deleteBook(id) {
//         return new Promise((resolve, reject) => {
//             db.run('DELETE FROM livres WHERE id = ?', [id], function (err) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//     }
//     updateBookQuantity(id, quantity) {
//         return new Promise((resolve, reject) => {
//             db.run('UPDATE livres SET quantite = ? WHERE id = ?', [quantity, id], function (err) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
//         });
//     }

//     updateBookAuthors(bookId, auteurIds) {
//         return new Promise((resolve, reject) => {
//             db.serialize(() => {
//                 db.run('BEGIN TRANSACTION');

//                 db.run('DELETE FROM auteur_livre WHERE id_livre = ?', [bookId], (err) => {
//                     if (err) {
//                         db.run('ROLLBACK');
//                         return reject(err);
//                     }

//                     const stmt = db.prepare('INSERT INTO auteur_livre (id_auteur, id_livre) VALUES (?, ?)');
//                     auteurIds.forEach(auteurId => {
//                         stmt.run(auteurId, bookId, (err) => {
//                             if (err) {
//                                 db.run('ROLLBACK');
//                                 return reject(err);
//                             }
//                         });
//                     });

//                     stmt.finalize((err) => {
//                         if (err) {
//                             db.run('ROLLBACK');
//                             return reject(err);
//                         }

//                         db.run('COMMIT', (err) => {
//                             if (err) {
//                                 db.run('ROLLBACK');
//                                 return reject(err);
//                             }
//                             resolve();
//                         });
//                     });
//                 });
//             });
//         });
//     }
// }

// module.exports = new BooksRepository();

const db = require('../config/database');
const Book = require('../models/book');

class BooksRepository {
    getBookById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM livres WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? new Book(row.id, row.titre, row.annee_publication, row.quantite) : null);
                }
            });
        });
    }

    getAllBooks() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT l.*, a.id as auteur_id, a.nom, a.prenom
                FROM livres l
                LEFT JOIN auteur_livre al ON l.id = al.id_livre
                LEFT JOIN auteurs a ON al.id_auteur = a.id
            `;
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const booksMap = new Map();
                    rows.forEach(row => {
                        if (!booksMap.has(row.id)) {
                            booksMap.set(row.id, new Book(row.id, row.titre, row.annee_publication, row.quantite, []));
                        }
                        if (row.auteur_id) {
                            booksMap.get(row.id).auteurs.push({
                                id: row.auteur_id,
                                nom: row.nom,
                                prenom: row.prenom
                            });
                        }
                    });
                    resolve(Array.from(booksMap.values()));
                }
            });
        });
    }

    getBookAndAuteurs(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT l.*, a.id as auteur_id, a.nom, a.prenom
                FROM livres l
                LEFT JOIN auteur_livre al ON l.id = al.id_livre
                LEFT JOIN auteurs a ON al.id_auteur = a.id
                WHERE l.id = ?
            `;
            db.all(query, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length > 0) {
                    const book = new Book(rows[0].id, rows[0].titre, rows[0].annee_publication, rows[0].quantite, []);
                    rows.forEach(row => {
                        if (row.auteur_id) {
                            book.auteurs.push({
                                id: row.auteur_id,
                                nom: row.nom,
                                prenom: row.prenom
                            });
                        }
                    });
                    resolve(book);
                } else {
                    resolve(null);
                }
            });
        });
    }

    createBook(bookData) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO livres (titre, annee_publication, quantite) VALUES (?, ?, ?)', 
                [bookData.titre, bookData.annee_publication, bookData.quantite],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        const bookId = this.lastID;
                        // Insérer les relations auteur-livre
                        const insertAuthorPromises = bookData.auteurs.map(authorId => 
                            new Promise((resolve, reject) => {
                                db.run('INSERT INTO auteur_livre (id_auteur, id_livre) VALUES (?, ?)', 
                                    [authorId, bookId], 
                                    err => err ? reject(err) : resolve()
                                );
                            })
                        );

                        Promise.all(insertAuthorPromises)
                            .then(() => resolve({ id: bookId, ...bookData }))
                            .catch(err => {
                                reject(err);
                            });
                    }
                }
            );
        });
    }

    updateBook(bookId, bookData) {
        return new Promise((resolve, reject) => {
            const { titre, annee_publication } = bookData;

            db.run('UPDATE livres SET titre = ?, annee_publication = ? WHERE id = ?', 
                [titre, annee_publication, bookId], 
                function(err) {
                    if (err) return reject(err);
                    resolve(this.changes);
                }
            );
        });
    }

    deleteBook(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM livres WHERE id = ?', [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    updateBookQuantity(id, quantity) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE livres SET quantite = ? WHERE id = ?', [quantity, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    updateBookAuthors(bookId, auteurIds) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                db.run('DELETE FROM auteur_livre WHERE id_livre = ?', [bookId], (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }

                    const stmt = db.prepare('INSERT INTO auteur_livre (id_auteur, id_livre) VALUES (?, ?)');
                    auteurIds.forEach(auteurId => {
                        stmt.run(auteurId, bookId, (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }
                        });
                    });

                    stmt.finalize((err) => {
                        if (err) {
                            db.run('ROLLBACK');
                            return reject(err);
                        }

                        db.run('COMMIT', (err) => {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }
                            resolve();
                        });
                    });
                });
            });
        });
    }
}

module.exports = new BooksRepository();
