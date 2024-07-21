const db = require('../config/database');
const Emprunt = require('../models/Emprunt');

class EmpruntsRepository {
    
    countEmpruntsEnCours(id_livre) {
        return new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) AS count FROM emprunts WHERE id_livre = ? AND date_retour IS NULL', [id_livre], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count);
                }
            });
        });
    }

    createEmprunt(empruntData) {
        return new Promise((resolve, reject) => {
            const { id_livre, id_personne, date_emprunt } = empruntData;
            db.run('INSERT INTO emprunts (id_livre, id_personne, date_emprunt) VALUES (?, ?, ?)', [id_livre, id_personne, date_emprunt], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Emprunt(this.lastID, id_livre, id_personne, date_emprunt));
                }
            });
        });
    }

    updateEmprunt(id, empruntData) {
        return new Promise((resolve, reject) => {
            const { date_retour } = empruntData;
            db.run('UPDATE emprunts SET date_retour = ? WHERE id = ?', [date_retour, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Emprunt(id, null, null, null, date_retour));
                }
            });
        });
    }
}

module.exports = new EmpruntsRepository();
