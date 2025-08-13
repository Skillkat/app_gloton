const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, productoController.index);
router.get('/create', isAuthenticated, productoController.create);
router.post('/', isAuthenticated, productoController.store); // Cambiado
router.get('/:id/edit', isAuthenticated, productoController.edit);
router.post('/:id', isAuthenticated, productoController.update);
router.post('/:id/delete', isAuthenticated, productoController.destroy);

module.exports = router;