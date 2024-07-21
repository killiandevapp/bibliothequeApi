const db = require('../config/database');

class searchRepository {
    searchBook(mots) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT l.id, l.titre, l.annee_publication, l.quantite,
                       a.nom as auteur_nom, a.prenom as auteur_prenom,
                       (CASE 
                            WHEN l.titre LIKE ? THEN 3 
                            WHEN a.nom LIKE ? OR a.prenom LIKE ? THEN 2 
                            ELSE 1 
                       END) as correspondance
                FROM livres l
                LEFT JOIN auteur_livre al ON l.id = al.id_livre
                LEFT JOIN auteurs a ON al.id_auteur = a.id
                WHERE l.titre LIKE ? OR a.nom LIKE ? OR a.prenom LIKE ?
                ORDER BY correspondance DESC
            `;
            const likeMots = `%${mots}%`;
            db.all(query, [likeMots, likeMots, likeMots, likeMots, likeMots, likeMots], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = new searchRepository();
