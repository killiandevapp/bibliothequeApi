const crypto = require('crypto');

function generateETag(content) {
    return crypto.createHash('md5').update(content).digest('hex');
}

module.exports = {
    generateETag
};
