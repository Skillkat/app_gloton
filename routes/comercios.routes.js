const express = require('express');
const router = express.Router();
const comercioController = require('../controllers/comercio.controller');
const { isAuthenticated, isTipo } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, isTipo('comercio'), comercioController.index); // Orden corregido, quitado render extra
router.get('/create', isAuthenticated, isTipo('comercio'), comercioController.create);
router.post('/', isAuthenticated, isTipo('comercio'), comercioController.store);
router.get('/:id/edit', isAuthenticated, isTipo('comercio'), comercioController.edit);
router.post('/:id', isAuthenticated, isTipo('comercio'), comercioController.update);
router.post('/:id/delete', isAuthenticated, isTipo('comercio'), comercioController.destroy);

module.exports = router;