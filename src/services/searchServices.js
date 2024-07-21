

const searchRepository = require('../repository/searchRepository');

class searchServices {

    async searchBook(mots) {
        return await searchRepository.searchBook(mots);
    }
}

module.exports = new searchServices();
