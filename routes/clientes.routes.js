const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware'); // Importa la función específica

router.get('/', isAuthenticated, (req, res) => {
    res.render('routes/cliente');
  });

router.get('/', isAuthenticated, clienteController.index);
router.get('/create', isAuthenticated, clienteController.create);
router.post('/create', isAuthenticated, clienteController.store);
router.get('/edit/:id', isAuthenticated, clienteController.edit);
router.post('/edit/:id', isAuthenticated, clienteController.update);
router.post('/delete/:id', isAuthenticated, clienteController.destroy);

module.exports = router;
