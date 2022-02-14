// import mongoose
const mongoose = require('mongoose');
// import du validateur unique
const uniqueValidator = require('mongoose-unique-validator');

// créer le schema utilisateur unique
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true }
});

// ajout du validateur comme plugin au schema avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

// export de ce schéma sous forme de modèle
module.exports = mongoose.model('User', userSchema);