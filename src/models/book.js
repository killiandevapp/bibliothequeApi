class Book {
    constructor(id, titre, annee_publication, quantite, auteurs = []) {
        this.id = id;
        this.titre = titre;
        this.annee_publication = annee_publication;
        this.quantite = quantite;
        this.auteurs = auteurs;
    }
}

module.exports = Book;