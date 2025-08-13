const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');

exports.index = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.render('usuarios/index', { usuarios });
  } catch (error) {
    console.error(error);
    res.render('usuarios/index', { usuarios: [], error: 'Error al cargar usuarios' });
  }
};

exports.create = (req, res) => {
  res.render('usuarios/create');
};

exports.store = async (req, res) => {
  try {
    const { contrasena, ...rest } = req.body;
    const hashed = await bcrypt.hash(contrasena, 10);
    await Usuario.create({ ...rest, contrasena: hashed });
    res.redirect('/usuarios');
  } catch (error) {
    console.error(error);
    res.render('usuarios/create', { error: 'Error al crear usuario' });
  }
};

exports.edit = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.redirect('/usuarios');
    res.render('usuarios/edit', { usuario });
  } catch (error) {
    console.error(error);
    res.redirect('/usuarios');
  }
};

exports.update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.contrasena) {
      data.contrasena = await bcrypt.hash(data.contrasena, 10);
    } else {
      delete data.contrasena; // No actualizar si vacío
    }
    await Usuario.update(data, { where: { id: req.params.id } });
    res.redirect('/usuarios');
  } catch (error) {
    console.error(error);
    const usuario = await Usuario.findByPk(req.params.id);
    res.render('usuarios/edit', { usuario, error: 'Error al actualizar usuario' });
  }
};

exports.destroy = async (req, res) => {
  try {
    await Usuario.destroy({ where: { id: req.params.id } });
    res.redirect('/usuarios');
  } catch (error) {
    console.error(error);
    res.redirect('/usuarios');
  }
};