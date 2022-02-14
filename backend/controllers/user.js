// import du package de cryptage bcrypt
const bcrypt = require('bcrypt');
// import de jsonwebtoken : permet de créer et vérifier des tokens
const jwt = require('jsonwebtoken');

// import du modèle User
const User = require('../models/User');

// middleware avec fonction signup
exports.signup = (req, res, next) => {
    // crypter le mdp avec hash, 10 tours.
    bcrypt.hash(req.body.password, 10)
        // fonction asynchrone
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // TODO vérifier que req.body.email est bien un mail. cf module de validation de node.js
            // enregistrer l'user dans la BDD
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));

        })
        .catch(error => res.status(500).json({error}));
};

// middleware avec la fonction login
exports.login = (req, res) => {
    // trouver l'utilisateur dans la BDD
    User.findOne({ email: req.body.email })
    .then(user => {
        // verifier si trouvé un user ou non
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        // comparer le mdp avec le hash enregistré dans le user
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                // boolean : si pas valable erreur
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user._id,
                    /* vérifier le token à chaque fois avec la fonction 
                    sign (payload, clé secrete pour encodage, config expiration)*/
                    token: jwt.sign(
                        { userId: user._id},
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));    
};