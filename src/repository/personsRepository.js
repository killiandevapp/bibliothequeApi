const db = require('../config/database');
const Person = require('../models/Person');

class PersonsRepository {
    getPersonByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM personnes WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? new Person(row.id, row.nom, row.prenom, row.email) : null);
                }
            });
        });
    }

    createPerson(personData) {
        return new Promise((resolve, reject) => {
            const { nom, prenom, email } = personData;
            db.run('INSERT INTO personnes (nom, prenom, email) VALUES (?, ?, ?)', [nom, prenom, email], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Person(this.lastID, nom, prenom, email));
                }
            });
        });
    }

    updatePerson(id, personData) {
        return new Promise((resolve, reject) => {
            const { nom, prenom, email } = personData;
            db.run('UPDATE personnes SET nom = ?, prenom = ?, email = ? WHERE id = ?', [nom, prenom, email, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Person(id, nom, prenom, email));
                }
            });
        });
    }
}

module.exports = new PersonsRepository();
