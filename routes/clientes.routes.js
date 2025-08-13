const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, clienteController.index);
router.get('/create', isAuthenticated, clienteController.create);
router.post('/', isAuthenticated, clienteController.store);
router.get('/:id/edit', isAuthenticated, clienteController.edit);
router.post('/:id', isAuthenticated, clienteController.update); // Cambiado de /:id/edit
router.post('/:id/delete', isAuthenticated, clienteController.destroy); // Ajustado

module.exports = router;