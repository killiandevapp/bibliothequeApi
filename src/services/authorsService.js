const authorsRepository = require('../repository/authorsRepository');



class AuthorsService {
    async getAllAuthors() {
        return await authorsRepository.getAllAuthors()
    }
    async getAuthor(id){
        return await authorsRepository.getAuthor(id)
    }
    async postAuthor(body){
        return await authorsRepository.postAuthor(body);
    }

    async putAuthor(id,body){
        return await authorsRepository.putAuthor(id,body)
    }

    
    async deleteAuthor(id) {

        const existAuthors = await authorsRepository.authorExists(id);
        if (!existAuthors) throw new Error("L'identifiant de l'auteur n'est pas reconnu");
        
        const checkAuthorBooks = await authorsRepository.checkAuthorBooks(id);
        if (checkAuthorBooks) throw new Error("L'auteur est associé a un ou plusieurs livres");

        const result = await authorsRepository.deleteAuthor(id);
        if (!result) throw new Error("Echec de la suppression de l'auteur");
       
        return { message: "Auteur supprimé avec succès" };
    }

}

module.exports = new AuthorsService