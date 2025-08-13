const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth.middleware'); // Corrige require

router.get('/', isAuthenticated, (req, res) => {
  res.render('admin/admin');
});

module.exports = router;

