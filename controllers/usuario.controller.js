const db = require('../models');
const Usuario = db.Usuario;

exports.index = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.render('usuarios/index', { usuarios });
};

exports.create = (req, res) => {
  res.render('usuarios/create');
};

exports.store = async (req, res) => {
  await Usuario.create(req.body);
  res.redirect('/usuarios');
};

exports.edit = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.render('usuarios/edit', { usuario });
};

exports.update = async (req, res) => {
  await Usuario.update(req.body, { where: { id: req.params.id } });
  res.redirect('/usuarios');
};

exports.destroy = async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.redirect('/usuarios');
};
