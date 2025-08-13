const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware'); // Importa la función específica

router.get('/', isAuthenticated, usuarioController.index);
router.get('/create', isAuthenticated, usuarioController.create);
router.post('/create', isAuthenticated, usuarioController.store);
router.get('/edit/:id', isAuthenticated, usuarioController.edit);
router.post('/edit/:id', isAuthenticated, usuarioController.update);
router.post('/delete/:id', isAuthenticated, usuarioController.destroy);

module.exports = router;
