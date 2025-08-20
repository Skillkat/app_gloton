const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carrito.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.post('/agregar', carritoController.agregar);
router.get('/', carritoController.index);
router.post('/actualizar', carritoController.actualizar);
router.get('/eliminar/:id_producto', carritoController.eliminar);
router.post('/confirmar', isAuthenticated, carritoController.confirmar);

module.exports = router;