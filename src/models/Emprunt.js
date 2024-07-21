class Emprunt {
    constructor(id, id_livre, id_personne, date_emprunt, date_retour = null) {
        this.id = id;
        this.id_livre = id_livre;
        this.id_personne = id_personne;
        this.date_emprunt = date_emprunt;
        this.date_retour = date_retour;
    }
}

module.exports = Emprunt;
