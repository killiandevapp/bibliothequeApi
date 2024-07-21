const authorsService = require('../services/authorsService')

exports.getAllAuthors = async (req, res, next) => {
  try {
    const authors = await authorsService.getAllAuthors();
    res.json(authors);
  } catch (error) {
    next(error); 
  }
}

exports.getAuthor = async (req, res, next) => {
  try {
    const author = await authorsService.getAuthor(req.params.id)
    res.json(author)
  } catch (error) {
    next(error); 
  }
}

exports.postAuthor = async (req, res, next) => {
  try {

    const newAuthor = await authorsService.postAuthor(req.body)
    console.log(req.body);
    res.status(201).json(newAuthor);
  } catch (error) {
    next(error)
  }
}

exports.putAuthor = async (req, res, next) => {
  try {
    const updateAuthor = await authorsService.putAuthor(req.params.id, req.body)
    res.json(updateAuthor)
  } catch (error) {
    next(error); 
  }

}

exports.deleteAuthor = async (req, res, next) => {
  try {
      const id = parseInt(req.params.id);
      await authorsService.deleteAuthor(id);
      res.status(200).json({ message: "Auteur supprimé avec succes" });
  } catch (error) {
      if (error.message === "L'identifiant de l'auteur n'est pas reconnu") {
          return res.status(404).json({ message: error.message });
      } else if (error.message === "L'auteur est associé a un ou plusieurs livres") {
          return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Une erreur est survenue lor de la suppression de l'auteur" });
  }
};