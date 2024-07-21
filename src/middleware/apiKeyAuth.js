const API_KEY = '8f94826adab8ffebbeadb4f9e161b2dc';

function apiKeyAuth(req, res, next) {
    const apiKey = req.get('API-Key');
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized. Invalid API Key ERROR 401.' });
    }

    next();
}

module.exports = apiKeyAuth;