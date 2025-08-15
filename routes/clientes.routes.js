const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

router.get('/', isAdmin, clienteController.index);
router.get('/create', isAdmin, clienteController.create);
router.post('/', isAdmin, clienteController.store);
router.get('/:id/edit', isAdmin, clienteController.edit);
router.put('/:id', isAdmin, clienteController.update);
router.delete('/:id', isAdmin, clienteController.destroy);

module.exports = router;