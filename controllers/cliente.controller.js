const db = require('../models');
const Cliente = db.Cliente;

exports.index = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.render('clientes/index', { clientes });
  } catch (error) {
    console.error(error);
    res.render('clientes/index', { clientes: [], error: 'Error al cargar clientes' });
  }
};

exports.create = (req, res) => {
  res.render('clientes/create');
};

exports.store = async (req, res) => {
  try {
    await Cliente.create(req.body);
    res.redirect('/clientes');
  } catch (error) {
    console.error(error);
    res.render('clientes/create', { error: 'Error al crear cliente' });
  }
};

exports.edit = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.redirect('/clientes');
    res.render('clientes/edit', { cliente });
  } catch (error) {
    console.error(error);
    res.redirect('/clientes');
  }
};

exports.update = async (req, res) => {
  try {
    await Cliente.update(req.body, { where: { id: req.params.id } }); // Cambiado de id_cliente a id
    res.redirect('/clientes');
  } catch (error) {
    console.error(error);
    const cliente = await Cliente.findByPk(req.params.id);
    res.render('clientes/edit', { cliente, error: 'Error al actualizar cliente' });
  }
};

exports.destroy = async (req, res) => {
  try {
    await Cliente.destroy({ where: { id: req.params.id } }); // Cambiado
    res.redirect('/clientes');
  } catch (error) {
    console.error(error);
    res.redirect('/clientes');
  }
};