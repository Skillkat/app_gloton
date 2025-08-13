const db = require('../models');
const { Pedido, Usuario, Comercio, Delivery } = db;

exports.index = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Usuario,
          as: 'cliente',
          attributes: ['id', 'nombre'],
        },
        {
          model: Comercio,
          as: 'comercio',
          attributes: ['id', 'nombre'],
          required: false,
        },
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'nombre'],
          required: false,
        },
      ],
    });
    res.render('pedidos/index', { pedidos, csrfToken: req.csrfToken() });
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    res.status(500).render('error', { message: 'Error al cargar los pedidos' });
  }
};

exports.create = async (req, res) => {
  const usuarios = await Usuario.findAll();
  const comercios = await Comercio.findAll();
  const deliverys = await Delivery.findAll();
  res.render('pedidos/create', { usuarios, comercios, deliverys, csrfToken: req.csrfToken() });
};

exports.store = async (req, res) => {
  await Pedido.create(req.body);
  res.redirect('/pedidos');
};

exports.edit = async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id);
  const usuarios = await Usuario.findAll();
  const comercios = await Comercio.findAll();
  const deliverys = await Delivery.findAll();
  res.render('pedidos/edit', { pedido, usuarios, comercios, deliverys, csrfToken: req.csrfToken() });
};

exports.update = async (req, res) => {
  await Pedido.update(req.body, { where: { id: req.params.id } });
  res.redirect('/pedidos');
};

exports.delete = async (req, res) => {
  await Pedido.destroy({ where: { id: req.params.id } });
  res.redirect('/pedidos');
};