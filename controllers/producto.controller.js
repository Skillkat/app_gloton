const db = require('../models');
const Producto = db.Producto;

exports.index = async (req, res) => {
  const productos = await Producto.findAll();
  res.render('productos/index', { productos });
};

exports.create = (req, res) => {
  res.render('productos/create');
};

exports.store = async (req, res) => {
  await Producto.create(req.body);
  res.redirect('/productos');
};

exports.edit = async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  res.render('productos/edit', { producto });
};

exports.update = async (req, res) => {
  await Producto.update(req.body, { where: { id: req.params.id } });
  res.redirect('/productos');
};

exports.destroy = async (req, res) => {
  await Producto.destroy({ where: { id: req.params.id } });
  res.redirect('/productos');
};
