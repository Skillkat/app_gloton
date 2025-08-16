const express = require('express');
const router = express.Router();
const comercioController = require('../controllers/comercio.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

router.get('/', isAdmin, comercioController.index);
router.get('/create', isAdmin, comercioController.create);
router.post('/', isAdmin, comercioController.store);
router.get('/:id/edit', isAdmin, comercioController.edit);
router.put('/:id', isAdmin, comercioController.update);
router.delete('/:id', isAdmin, comercioController.destroy);

module.exports = router;