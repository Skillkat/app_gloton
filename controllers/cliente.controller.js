const db = require('../models');
const Cliente = db.Cliente;

exports.index = async (req, res) => {
  try {
    console.log('Cargando lista de clientes...');
    const clientes = await Cliente.findAll();
    console.log('Clientes encontrados:', clientes);
    res.render('clientes/index', { clientes });
  } catch (error) {
    console.error('Error al cargar clientes:', error);
    res.status(500).render('error', { message: 'Error al cargar los clientes' });
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
    console.error('Error al crear cliente:', error);
    res.status(500).render('error', { message: 'Error al crear cliente' });
  }
};

exports.edit = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id_cliente); // Usar id_cliente
    if (!cliente) return res.redirect('/clientes');
    res.render('clientes/edit', { cliente });
  } catch (error) {
    console.error('Error al editar cliente:', error);
    res.status(500).render('error', { message: 'Error al cargar datos del cliente' });
  }
};

exports.update = async (req, res) => {
  try {
    await Cliente.update(req.body, { where: { id_cliente: req.params.id } }); // Usar id_cliente
    res.redirect('/clientes');
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    const cliente = await Cliente.findByPk(req.params.id);
    res.status(500).render('error', { message: 'Error al actualizar cliente' });
  }
};

exports.destroy = async (req, res) => {
  try {
    await Cliente.destroy({ where: { id_cliente: req.params.id } }); // Usar id_cliente
    res.redirect('/clientes');
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).render('error', { message: 'Error al eliminar cliente' });
  }
};