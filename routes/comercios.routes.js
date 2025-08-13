const express = require('express');
const router = express.Router();
const comercioController = require('../controllers/comercio.controller');
const { isAuthenticated, isTipo } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, comercioController.index, isTipo('comercio'), (req, res) => {
  res.render('comercio/index');
});

router.get('/create', isAuthenticated, comercioController.create);
router.post('/create', isAuthenticated, comercioController.store);
router.get('/edit/:id', isAuthenticated, comercioController.edit);
router.post('/edit/:id', isAuthenticated, comercioController.update);
router.post('/delete/:id', isAuthenticated, comercioController.destroy);

module.exports = router;
