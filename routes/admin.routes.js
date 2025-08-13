const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

// Middleware de autenticación
router.get('/', authMiddleware.isAuthenticated, (req, res) => {
    res.render('admin/admin');
  });

module.exports = router;
