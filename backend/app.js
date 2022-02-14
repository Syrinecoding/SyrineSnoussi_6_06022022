//installation Dotenv
require('dotenv').config();
//console.log(process.env);
// importation d'express
const express = require('express');
//installation Helmet
const helmet = require('helmet');
// installation Cors 
// TODO verifier comment configurer cors
const cors = require('cors');
// importation de mongoose
const mongoose = require('mongoose');
// importation de path pour accéder au path du serveur
const path = require('path');

// import des routeurs
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// connexion de l'app avec mongoose qui gère la base de donnée MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASS}@${process.env.DB_CLUSTER_NAME}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, 
{   useNewUrlParser: true,
    useUnifiedTopology: true})
.then(() => console.log('connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// appel de la méthode express
const app = express();
app.use(helmet());
app.use(cors());

// Prévention des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.use(express.json());


// Routes : methode app.use permet d'attribuer un middlewre à une route spécifique.
/* express.static gère de manière statique la ressource images 
à chaque requête vers la route images */
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


// export de cette variable depuis le server Node notamment
module.exports = app;