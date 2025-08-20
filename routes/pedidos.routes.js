const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedido.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, controller.index);
router.get('/create', isAuthenticated, controller.create);
router.post('/store', isAuthenticated, controller.store);
router.get('/edit/:id', isAuthenticated, controller.edit);
router.post('/update/:id', isAuthenticated, controller.update);
router.post('/delete/:id', isAuthenticated, controller.delete); // Cambiado de GET a POST

module.exports = router;