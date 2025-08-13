const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, usuarioController.index);
router.get('/create', isAuthenticated, usuarioController.create);
router.post('/', isAuthenticated, usuarioController.store);
router.get('/:id/edit', isAuthenticated, usuarioController.edit);
router.post('/:id', isAuthenticated, usuarioController.update);
router.post('/:id/delete', isAuthenticated, usuarioController.destroy);

module.exports = router;