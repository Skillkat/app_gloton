const db = require('../models');
const Pedido = db.Pedido;
const Usuario = db.Usuario;
const Comercio = db.Comercio;
const Delivery = db.Delivery;

// Mostrar todos los pedidos
exports.index = async (req, res) => {
  const pedidos = await Pedido.findAll({ include: [Usuario, Comercio, Delivery] });
  res.render('pedidos/index', { pedidos });
};

// Formulario para crear un nuevo pedido
exports.create = async (req, res) => {
  const usuarios = await Usuario.findAll();
  const comercios = await Comercio.findAll();
  const deliverys = await Delivery.findAll();
  res.render('pedidos/create', { usuarios, comercios, deliverys });
};

// Guardar pedido
exports.store = async (req, res) => {
  await Pedido.create(req.body);
  res.redirect('/pedidos');
};

// Formulario de edición
exports.edit = async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id);
  const usuarios = await Usuario.findAll();
  const comercios = await Comercio.findAll();
  const deliverys = await Delivery.findAll();
  res.render('pedidos/edit', { pedido, usuarios, comercios, deliverys });
};

// Actualizar pedido
exports.update = async (req, res) => {
  await Pedido.update(req.body, { where: { id: req.params.id } });
  res.redirect('/pedidos');
};

// Eliminar pedido
exports.delete = async (req, res) => {
  await Pedido.destroy({ where: { id: req.params.id } });
  res.redirect('/pedidos');
};
