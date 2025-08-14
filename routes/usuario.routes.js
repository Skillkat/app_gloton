const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

router.get('/', isAdmin, usuarioController.index);
router.get('/create', isAdmin, usuarioController.create);
router.post('/', isAdmin, usuarioController.store);
router.get('/:id/edit', isAdmin, usuarioController.edit);
router.put('/:id', isAdmin, usuarioController.update);
router.delete('/:id', isAdmin, usuarioController.destroy);

module.exports = router;