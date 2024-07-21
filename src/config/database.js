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

        db.run(`CREATE TABLE IF NOT EXISTS metadata (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Erreur lors de la création de la table metadata:', err.message);
            } else {
                console.log('Table metadata créée avec succès');
                checkAndInsertInitialData();
            }
        });
    });
}

// Fonction pour vérifier et insérer les données initiales si nécessaire
function checkAndInsertInitialData() {
    db.get(`SELECT value FROM metadata WHERE key = 'initialized'`, (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'initialisation:', err.message);
            return;
        }

        if (!row) {
            insertInitialData();
        } else {
            console.log('Les données initiales ont déjà été insérées.');
        }
    });
}

// Fonction pour insérer les données initiales

// Fonction pour insérer les données initiales
function insertInitialData() {
    db.serialize(() => {
        db.run(`INSERT INTO auteurs (nom, prenom, annee_naissance, annee_mort) VALUES
            ('Hugo', 'Victor', 1802, 1885),
            ('Dumas', 'Alexandre', 1802, 1870),
            ('Flaubert', 'Gustave', 1821, 1880),
            ('Proust', 'Marcel', 1871, 1922),
            ('Zola', 'Émile', 1840, 1902),
            ('Saint-Exupéry', 'Antoine de', 1900, 1944),
            ('Camus', 'Albert', 1913, 1960),
            ('Duras', 'Marguerite', 1914, 1996),
            ('Sartre', 'Jean-Paul', 1905, 1980),
            ('Maupassant', 'Guy de', 1850, 1893)`, (err) => {
                if (err) {
                    console.error('Erreur lors de l\'insertion des auteurs:', err.message);
                    return;
                }
                console.log('Auteurs insérés avec succès');
            });

        db.run(`INSERT INTO livres (titre, annee_publication, quantite) VALUES
            ('Les Misérables', 1862, 5),
            ('Le Comte de Monte-Cristo', 1844, 4),
            ('Madame Bovary', 1857, 3),
            ('À la recherche du temps perdu', 1913, 2),
            ('L''Assommoir', 1877, 2),
            ('Le Petit Prince', 1943, 10),
            ('L''Étranger', 1942, 8),
            ('L''Amant', 1984, 3),
            ('La Nausée', 1938, 2),
            ('Bel-Ami', 1885, 4)`, (err) => {
                if (err) {
                    console.error('Erreur lors de l\'insertion des livres:', err.message);
                    return;
                }
                console.log('Livres insérés avec succès');
            });

        db.run(`INSERT INTO auteur_livre (id_auteur, id_livre) VALUES
            ((SELECT id FROM auteurs WHERE nom='Hugo' AND prenom='Victor'), (SELECT id FROM livres WHERE titre='Les Misérables')),
            ((SELECT id FROM auteurs WHERE nom='Dumas' AND prenom='Alexandre'), (SELECT id FROM livres WHERE titre='Le Comte de Monte-Cristo')),
            ((SELECT id FROM auteurs WHERE nom='Flaubert' AND prenom='Gustave'), (SELECT id FROM livres WHERE titre='Madame Bovary')),
            ((SELECT id FROM auteurs WHERE nom='Proust' AND prenom='Marcel'), (SELECT id FROM livres WHERE titre='À la recherche du temps perdu')),
            ((SELECT id FROM auteurs WHERE nom='Zola' AND prenom='Émile'), (SELECT id FROM livres WHERE titre='L''Assommoir')),
            ((SELECT id FROM auteurs WHERE nom='Saint-Exupéry' AND prenom='Antoine de'), (SELECT id FROM livres WHERE titre='Le Petit Prince')),
            ((SELECT id FROM auteurs WHERE nom='Camus' AND prenom='Albert'), (SELECT id FROM livres où titre='L''Étranger')),
            ((SELECT id FROM auteurs où nom='Duras' ET prénom='Marguerite'), (SELECT id FROM livres où titre='L''Amant')),
            ((SELECT id FROM auteurs où nom='Sartre' ET prénom='Jean-Paul'), (SELECT id FROM livres où titre='La Nausée')),
            ((SELECT id FROM auteurs où nom='Maupassant' ET prénom='Guy de'), (SELECT id FROM livres où titre='Bel-Ami'))`, (err) => {
                if (err) {
                    console.error('Erreur lors de l\'insertion des relations auteur_livre:', err.message);
                    return;
                }
                console.log('Relations auteur_livre insérées avec succès');
            });

        db.run(`INSERT INTO metadata (key, value) VALUES ('initialized', 'true')`, (err) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la table metadata:', err.message);
            } else {
                console.log('Base de données initialisée avec succès');
            }
        });
    });
}


module.exports = db;
