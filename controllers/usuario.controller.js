const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');

exports.index = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ raw: true });
    console.log('Usuarios encontrados:', usuarios);
    res.render('usuarios/index', { 
      usuarios,
      message: usuarios.length ? null : 'No se encontraron usuarios',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    req.flash('error', 'Error al cargar usuarios');
    res.render('usuarios/index', { usuarios: [], success: req.flash('success'), error: req.flash('error') });
  }
};

exports.create = (req, res) => {
  res.render('usuarios/create', { error: req.flash('error'), nombre: '', correo: '', tipo: '' });
};

exports.store = async (req, res) => {
  try {
    const { nombre, correo, tipo, contrasena } = req.body;
    if (!['cliente', 'comercio', 'delivery', 'admin'].includes(tipo)) {
      throw new Error('Tipo de usuario inválido');
    }
    const hashed = await bcrypt.hash(contrasena, 10);
    await Usuario.create({ nombre, correo, tipo, contrasena: hashed });
    req.flash('success', 'Usuario creado exitosamente');
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error al crear usuario:', error);
    req.flash('error', error.message || 'Error al crear usuario');
    res.render('usuarios/create', { 
      error: req.flash('error'), 
      nombre: req.body.nombre, 
      correo: req.body.correo, 
      tipo: req.body.tipo 
    });
  }
};

exports.edit = async (req, res) => {
  try {
    console.log('Buscando usuario con ID:', req.params.id); // Depuración
    const usuario = await Usuario.findByPk(req.params.id, { raw: true });
    console.log('Usuario encontrado:', usuario); // Depuración
    if (!usuario) {
      req.flash('error', 'Usuario no encontrado');
      return res.redirect('/usuarios');
    }
    console.log('Renderizando edit.hbs con usuario:', usuario); // Depuración
    res.render('usuarios/edit', { 
      usuario, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  } catch (error) {
    console.error('Error al cargar usuario para editar:', error);
    req.flash('error', 'Error al cargar usuario: ' + error.message);
    res.redirect('/usuarios');
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, correo, tipo, contrasena } = req.body;
    if (!['cliente', 'comercio', 'delivery', 'admin'].includes(tipo)) {
      throw new Error('Tipo de usuario inválido');
    }
    const data = { nombre, correo, tipo };
    if (contrasena) {
      data.contrasena = await bcrypt.hash(contrasena, 10);
    }
    const [updated] = await Usuario.update(data, { where: { id: req.params.id } });
    if (!updated) {
      req.flash('error', 'Usuario no encontrado');
      return res.redirect('/usuarios');
    }
    req.flash('success', 'Usuario actualizado exitosamente');
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    req.flash('error', error.message || 'Error al actualizar usuario');
    const usuario = await Usuario.findByPk(req.params.id, { raw: true }) || req.body;
    res.render('usuarios/edit', { usuario, error: req.flash('error'), success: req.flash('success') });
  }
};

exports.destroy = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.session.userId) {
      req.flash('error', 'No puedes eliminar tu propio usuario');
      return res.redirect('/usuarios');
    }
    const [destroyed] = await Usuario.destroy({ where: { id: req.params.id } });
    if (!destroyed) {
      req.flash('error', 'Usuario no encontrado');
      return res.redirect('/usuarios');
    }
    req.flash('success', 'Usuario eliminado exitosamente');
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    req.flash('error', 'Error al eliminar usuario');
    res.redirect('/usuarios');
  }
};