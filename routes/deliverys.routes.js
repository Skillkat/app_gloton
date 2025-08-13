const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const { isAuthenticated, isTipo } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, deliveryController.index, isTipo('delivery'), (req, res) => {
  res.render('delivery/index');
});

router.get('/create', isAuthenticated, deliveryController.create);
router.post('/create', isAuthenticated, deliveryController.store);
router.get('/edit/:id', isAuthenticated, deliveryController.edit);
router.post('/edit/:id', isAuthenticated, deliveryController.update);
router.post('/delete/:id', isAuthenticated, deliveryController.destroy);

module.exports = router;
