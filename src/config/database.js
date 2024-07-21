const sqlite3 = require('sqlite3').verbose();

// Créez la base de données ou connectez-vous à une base de données existante
const db = new sqlite3.Database('./bibliotheque.db', (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
    } else {
        console.log('Connecté à la base de données SQLite');
        createTables();
    }
});

// Fonction pour créer les tables nécessaires
function createTables() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS auteurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom VARCHAR(255) NOT NULL,
            prenom VARCHAR(255) NOT NULL,
            annee_naissance INTEGER,
            annee_mort INTEGER
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table auteurs:', err.message);
            } else {
                console.log('Table auteurs créée avec succès');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS livres (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre VARCHAR(255) NOT NULL,
            annee_publication INTEGER,
            quantite INTEGER NOT NULL DEFAULT 1
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table livres:', err.message);
            } else {
                console.log('Table livres créée avec succès');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS emprunts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_livre INTEGER NOT NULL,
            id_personne INTEGER NOT NULL,
            date_emprunt DATE NOT NULL,
            date_retour DATE,
            FOREIGN KEY (id_livre) REFERENCES livres(id),
            FOREIGN KEY (id_personne) REFERENCES personnes(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table emprunts:', err.message);
            } else {
                console.log('Table emprunts créée avec succès');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS personnes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom VARCHAR(255) NOT NULL,
            prenom VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table personnes:', err.message);
            } else {
                console.log('Table personnes créée avec succès');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS auteur_livre (
            id_livre INTEGER NOT NULL,
            id_auteur INTEGER NOT NULL,
            PRIMARY KEY (id_livre, id_auteur),
            FOREIGN KEY (id_livre) REFERENCES livres(id),
            FOREIGN KEY (id_auteur) REFERENCES auteurs(id)
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table auteur_livre:', err.message);
            } else {
                console.log('Table auteur_livre créée avec succès');
            }
        });
    });
}

module.exports = db;
