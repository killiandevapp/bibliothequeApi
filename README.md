# Bibliothèque API

## Prérequis

- **Node.js** et **npm** installés.
- **SQLite** pour la base de données.
- **API Key**: `8f94826adab8ffebbeadb4f9e161b2dc`.

## Initialisation de la Base de Données

Le fichier `config/database.js` initialise la base de données SQLite et crée les tables nécessaires.

## Sécurisation de l'API

L'API est sécurisée avec une clé API. Toute requête doit inclure l'en-tête `API-Key` avec la valeur `8f94826adab8ffebbeadb4f9e161b2dc`.

- **middleware/apiKeyAuth.js** : Middleware pour sécuriser l'API avec une clé API.

## Gestion des livres

### Routes

- **routes/booksRoutes.js** : Définition des routes pour les opérations CRUD sur les livres et gestion des quantités.

### Contrôleurs

- **controllers/booksController.js** : Logique des contrôleurs pour gérer les requêtes liées aux livres.

### Services

- **services/booksService.js** : Logique métier pour les opérations sur les livres.

### Référentiels

- **repository/booksRepository.js** : Interactions avec la base de données pour les livres.

## Gestion des auteurs

### Routes

- **routes/authorsRoutes.js** : Définition des routes pour les opérations CRUD sur les auteurs.

### Contrôleurs

- **controllers/authorsController.js** : Logique des contrôleurs pour gérer les requêtes liées aux auteurs.

### Services

- **services/authorsService.js** : Logique métier pour les opérations sur les auteurs.

### Référentiels

- **repository/authorsRepository.js** : Interactions avec la base de données pour les auteurs.

## Gestion des emprunts

### Routes

- **routes/empruntsRoutes.js** : Définition des routes pour les opérations sur les emprunts.

### Contrôleurs

- **controllers/empruntsController.js** : Logique des contrôleurs pour gérer les requêtes liées aux emprunts.

### Services

- **services/empruntsService.js** : Logique métier pour les opérations sur les emprunts.

### Référentiels

- **repository/empruntsRepository.js** : Interactions avec la base de données pour les emprunts.

## Recherche

### Routes

- **routes/searchRoutes.js** : Définition des routes pour la recherche de livres par mots-clés.

### Contrôleurs

- **controllers/searchController.js** : Logique des contrôleurs pour gérer les requêtes de recherche.

## Utilitaires

- **utils/etag.js** : Génération et validation des ETags pour empêcher les modifications concurrentes.

## Middleware

- **middleware/apiKeyAuth.js** : Middleware pour sécuriser l'API avec une clé API.

## Système d'ETag

L'utilisation d'ETag est implémentée dans les routes suivantes :
- **GET /livre/{id}**
- **PUT /livre/{id}**

Ces routes utilisent l'ETag pour éviter les modifications concurrentes.

## Initialisation du serveur

- **server.js** : Point d'entrée principal de l'application, initialise et démarre le serveur Express.

## Points d'entrée de l'API

### Gestion des livres

| Méthode | URL                   | Description |
|---------|-----------------------|-------------|
| GET     | /livre                | Retourne la liste des livres avec les informations des auteurs |
| GET     | /livre/{id}           | Retourne la fiche du livre portant l’ID indiquée, avec les informations des auteurs associés |
| POST    | /livre                | Crée le livre selon les informations du corps de la requête |
| PUT     | /livre/{id}           | Modifie le livre selon les informations du corps de la requête |
| GET     | /livre/{id}/quantite  | Retourne la quantité totale et la quantité disponible pour le livre |
| PUT     | /livre/{id}/quantite  | Modifie la quantité totale pour le livre |
| DELETE  | /livre/{id}           | Supprime le livre |

### Gestion des auteurs

| Méthode | URL            | Description |
|---------|----------------|-------------|
| GET     | /auteur        | Retourne la liste des auteurs |
| GET     | /auteur/{id}   | Retourne la fiche de l’auteur portant l’ID indiquée |
| POST    | /auteur        | Crée l’auteur selon les informations du corps de la requête |
| PUT     | /auteur/{id}   | Modifie l’auteur selon les informations

### Gestion des emprunts

| Méthode | URL             | Description |
|---------|-----------------|-------------|
| POST    | /emprunt        | Crée un emprunt selon les informations du corps de la requête |
| PUT     | /emprunt/{id}   | Modifie l’emprunt (remplis la date de retour) |

### Recherche

| Méthode | URL             | Description |
|---------|-----------------|-------------|
| GET     | /recherche/{mots} | Recherche des livres selon les mots fournis parmi le titre et le nom/prénom de l’auteur |
