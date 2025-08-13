const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { isAuthenticated, isTipo } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, isTipo('delivery'), deliveryController.index);
router.get('/create', isAuthenticated, isTipo('delivery'), deliveryController.create);
router.post('/', isAuthenticated, isTipo('delivery'), deliveryController.store);
router.get('/:id/edit', isAuthenticated, isTipo('delivery'), deliveryController.edit);
router.post('/:id', isAuthenticated, isTipo('delivery'), deliveryController.update);
router.post('/:id/delete', isAuthenticated, isTipo('delivery'), deliveryController.destroy);

module.exports = router;