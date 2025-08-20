const express = require('express');
const router = express.Router();
const db = require('../models');
const Producto = db.Producto;

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({ where: { disponible: true }, raw: true });
    res.render('home', { 
      user: req.session.user,
      productos,
      message: productos.length ? null : 'No se encontraron productos disponibles'
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.render('home', { 
      user: req.session.user,
      productos: [],
      message: 'Error al cargar productos'
    });
  }
});

module.exports = router;