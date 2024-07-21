
const empruntsServices = require('../services/empruntsServices');

exports.postEmprunt = async (req, res, next) => {
    try {
        const emprunt = await empruntsServices.createEmprunt(req.body.id_livre, req.body);
        res.status(201).json(emprunt);
    } catch (error) {
        console.error('Erreur lors de la création de l\'emprunt:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.updateEmprunt = async (req, res, next) => {
    try {
        const emprunt = await empruntsServices.updateEmprunt(req.params.id, req.body);
        res.status(200).json(emprunt);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'emprunt:', error.message);
        res.status(400).json({ message: error.message });
    }
};

