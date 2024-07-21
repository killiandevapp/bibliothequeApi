const express = require('express');
const apiKeyAuth = require('./src/middleware/apiKeyAuth');
const booksRoutes = require('./src/routes/books');
const authorsRoutes = require('./src/routes/authors')
const empruntRoutes = require('./src/routes/emprunt')
const searchRoutes = require('./src/routes/search')
const app = express();

app.use(express.json());
app.use(apiKeyAuth);

// Routes 
app.use('/api/livre', booksRoutes);
app.use('/api/auteur', authorsRoutes);
app.use('/api/emprunt', empruntRoutes);
app.use('/api/recherche', searchRoutes);


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server lancer url : http://localhost:${PORT}`);
});