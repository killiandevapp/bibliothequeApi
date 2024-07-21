

const searchServices = require('../services/searchServices')


exports.searchBook = async (req, res, next) =>{
    try {
        const resultats = await searchServices.searchBook(req.params.mots);
        res.status(200).json(resultats);
    } catch (error) {
        console.error('Erreur lors de la recherche de livres:', error.message);
        res.status(400).json({ message: error.message });
    }
}