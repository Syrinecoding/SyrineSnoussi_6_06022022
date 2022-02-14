// import express
const express = require('express');
// creer un routeur
const router = express.Router();
// import du controller du user
const userCtrl = require('../controllers/user');

// routes pour user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// exporter ce router
module.exports = router;