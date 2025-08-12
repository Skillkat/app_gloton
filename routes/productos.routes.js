const express = require('express');
const router = express.Router();
const productoController = require('../controllers/producto.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, productoController.index);
router.get('/create', isAuthenticated, productoController.create);
router.post('/create', isAuthenticated, productoController.store);
router.get('/edit/:id', isAuthenticated, productoController.edit);
router.post('/edit/:id', isAuthenticated, productoController.update);
router.post('/delete/:id', isAuthenticated, productoController.destroy);

module.exports = router;
