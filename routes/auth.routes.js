const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
console.log(authController);

// Mostrar formularios
router.get('/login', authController.showLogin);
router.get('/register', authController.showRegister);

// Procesar formularios
router.post('/register', authController.register);
router.post('/login', authController.login);

// Logout
// router.get('/logout', authController.logout);

module.exports = router;
