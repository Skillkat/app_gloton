const db = require('../models');
const DetallePedido = db.DetallePedido;
const Pedido = db.Pedido;
const Producto = db.Producto;


// Mostrar todos los detalles de pedidos
exports.index = async (req, res) => {
  const detalles = await DetallePedido.findAll({ include: [Pedido, Producto] });
  res.render('detalle_pedidos/index', { detalles });
};

// Formulario para crear un nuevo detalle de pedido
exports.create = async (req, res) => {
  const pedidos = await Pedido.findAll();
  const productos = await Producto.findAll();
  res.render('detalle_pedidos/create', { pedidos, productos });
};

// Guardar un nuevo detalle
exports.store = async (req, res) => {
  await DetallePedido.create(req.body);
  res.redirect('/detalle_pedidos');
};

// Formulario de edición
exports.edit = async (req, res) => {
  const detalle = await DetallePedido.findByPk(req.params.id);
  const pedidos = await Pedido.findAll();
  const productos = await Producto.findAll();
  res.render('detalle_pedidos/edit', { detalle, pedidos, productos });
};

// Actualizar detalle
exports.update = async (req, res) => {
  await DetallePedido.update(req.body, { where: { id: req.params.id } });
  res.redirect('/detalle_pedidos');
};

// Eliminar detalle
exports.delete = async (req, res) => {
  await DetallePedido.destroy({ where: { id: req.params.id } });
  res.redirect('/detalle_pedidos');
};


