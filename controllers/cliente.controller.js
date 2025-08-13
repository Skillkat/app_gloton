const db = require('../models');
const Cliente = db.Cliente;

exports.index = async (req, res) => {
  const clientes = await Cliente.findAll();
  res.render('clientes/index', { clientes });
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
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.redirect('/clientes');
  res.render('clientes/edit', { cliente });
};

exports.update = async (req, res) => {
  try {
    await Cliente.update(req.body, { where: { id_cliente: req.params.id } });
    res.redirect('/clientes');
  } catch (error) {
    console.error(error);
    res.render('clientes/edit', { error: 'Error al actualizar cliente' });
  }
};

exports.destroy = async (req, res) => {
  try {
    await Cliente.destroy({ where: { id_cliente: req.params.id } });
    res.redirect('/clientes');
  } catch (error) {
    console.error(error);
    res.redirect('/clientes');
  }
};
