const db = require('../config/database');
const Author = require('../models/author');

class AuthorsRepository {


    // authorExists(id) {
    //     return new Promise((resolve, reject) => {
    //         db.get('SELECT 1 FROM auteurs WHERE id = ?', [id], (err, row) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(!!row);
    //             }
    //         });
    //     });
    // }
    authorExists(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT 1 FROM auteurs WHERE id = ?', [id], (err, row) => {
                if (err) {
                    if (err.code === 'SQLITE_ERROR' && err.message.includes('no such table')) {
                        // Si la table n'existe pas, renvoyer une erreur spécifique
                        return reject(new Error(`Auteur non trouvé: l'ID ${id} n'existe pas`));
                    }
                    console.error('Erreur lors de la vérification de l\'auteur:', err);
                    return reject(err);
                } else {
                    resolve(!!row);
                }
            });
        });
    }

    getAllAuthors() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM auteurs ', (err, row) => {
                console.log(row);
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    getAuthor(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM auteurs WHERE id = ? LIMIT 1', [id], (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }
    postAuthor(authorData) {
        return new Promise((resolve, reject) => {
            const { nom, prenom, annee_naissance, annee_mort } = authorData;
            const requestSql = 'INSERT INTO auteurs (nom, prenom, annee_naissance, annee_mort) VALUES (?, ?, ?, ?)';
            db.run(requestSql, [nom, prenom, annee_naissance, annee_mort],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        const newAuthor = new Author(
                            this.lastID,
                            nom,
                            prenom,
                            annee_naissance,
                            annee_mort
                        );
                        resolve(newAuthor);
                    }
                }
            );
        });
    }
     createAnonymousAuthor() {
        return new Promise((resolve, reject) => {
            const nom = 'Anonyme';
            const prenom = 'Anonyme';
            const annee_naissance = 0;
            const annee_mort = 0;

            const requestSql = 'INSERT INTO auteurs (nom, prenom, annee_naissance, annee_mort) VALUES (?, ?, ?, ?)';
            db.run(requestSql, [nom, prenom, annee_naissance, annee_mort],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID });
                    }
                }
            );
        });
    }


    putAuthor(id, authorData) {
        return new Promise((resolve, reject) => {
            const { nom, prenom, annee_naissance, annee_mort } = authorData;
            const sqlResuest = 'UPDATE auteurs SET nom = ?, prenom = ?, annee_naissance = ?, annee_mort = ?  WHERE id = ?'
            db.run(sqlResuest, [nom, prenom, annee_naissance, annee_mort, id],
                function (err) {306
                    if (err) {
                        reject(err)
                    }
                    resolve(this.changes);

                }
            )
        })
    }

    checkAuthorBooks(id) {
        return new Promise((resolve, reject) => {
            const sqlRequest = 'SELECT * FROM auteur_livre WHERE id_auteur = ?';
            db.get(sqlRequest, [id], function (err, row) {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    deleteAuthor(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM auteurs WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression de l\'auteur:', err);
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null);
                } else {
                    resolve({ id: id, deleted: true });
                }
            });
        });
    }


}
module.exports = new AuthorsRepository();