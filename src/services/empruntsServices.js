const personsRepository = require('../repository/personsRepository');
const booksRepository = require('../repository/booksRepository');
const empruntsRepository = require('../repository/empruntsRepository');

class EmpruntsService {

    async createEmprunt(id_livre, body) {

        const livre = await booksRepository.getBookById(id_livre);
        if (!livre) {
            throw new Error('Livre non trouvé');
        }

        const nombreEmpruntsEnCours = await empruntsRepository.countEmpruntsEnCours(id_livre);
        const quantiteDisponible = livre.quantite - nombreEmpruntsEnCours;

        if (quantiteDisponible <= 0) {
            throw new Error('Le livre n\'est pas empruntable (quantité disponible = zéro)');
        }

        let personne = await personsRepository.getPersonByEmail(body.email);
        if (!personne) {
            personne = await personsRepository.createPerson(body);
        } else {
            personne = await personsRepository.updatePerson(personne.id, body);
        }


        const date_emprunt = new Date().toISOString().split('T')[0];
        const emprunt = await empruntsRepository.createEmprunt({
            id_livre,
            id_personne: personne.id,
            date_emprunt
        });

        return emprunt;
    }

    async updateEmprunt(id, body) {
        const date_retour = new Date().toISOString().split('T')[0];
        const emprunt = await empruntsRepository.updateEmprunt(id, { date_retour });

        return emprunt;
    }
}

module.exports = new EmpruntsService();
