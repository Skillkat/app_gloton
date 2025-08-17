const db = require('../models');
const Cliente = db.Cliente;
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');

exports.index = async (req, res) => {
  try {
    console.log('Cargando lista de clientes...');
    const clientes = await Cliente.findAll({ raw: true });
    console.log('Clientes encontrados:', clientes);
    res.render('clientes/index', { 
      clientes,
      message: clientes.length ? null : 'No se encontraron clientes',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error al cargar clientes:', error);
    req.flash('error', 'Error al cargar clientes');
    res.render('clientes/index', { clientes: [], success: req.flash('success'), error: req.flash('error') });
  }
};

exports.create = (req, res) => {
  res.render('clientes/create', { 
    error: req.flash('error'), 
    nombre: '', 
    correo: '', 
    direccion: '', 
    telefono: '' 
  });
};

exports.store = async (req, res) => {
  try {
    const { nombre, correo, direccion, telefono, contrasena } = req.body;
    console.log('Creando cliente con datos:', { nombre, correo, direccion, telefono }); // Depuración

    // Crear usuario asociado con tipo 'cliente'
    const hashed = await bcrypt.hash(contrasena, 10);
    const usuario = await Usuario.create({ 
      nombre, 
      correo, 
      contrasena: hashed, 
      tipo: 'cliente' 
    });

    // Crear cliente con el id del usuario
    await Cliente.create({ 
      id_cliente: usuario.id, 
      nombre, 
      correo, 
      direccion, 
      telefono 
    });

    req.flash('success', 'Cliente creado exitosamente');
    res.redirect('/clientes');
  } catch (error) {
    console.error('Error al crear cliente:', error);
    req.flash('error', error.message || 'Error al crear cliente');
    res.render('clientes/create', { 
      error: req.flash('error'), 
      nombre: req.body.nombre || '', 
      correo: req.body.correo || '', 
      direccion: req.body.direccion || '', 
      telefono: req.body.telefono || '' 
    });
  }
};

exports.edit = async (req, res) => {
  try {
    console.log('Buscando cliente con ID:', req.params.id); // Depuración
    const cliente = await Cliente.findByPk(req.params.id, { raw: true });
    console.log('Cliente encontrado:', cliente); // Depuración
    if (!cliente) {
      req.flash('error', 'Cliente no encontrado');
      return res.redirect('/clientes');
    }
    res.render('clientes/edit', { 
      cliente, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  } catch (error) {
    console.error('Error al cargar cliente para editar:', error);
    req.flash('error', 'Error al cargar cliente: ' + error.message);
    res.redirect('/clientes');
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, correo, direccion, telefono } = req.body;
    console.log('Actualizando cliente con ID:', req.params.id, 'Datos:', { nombre, correo, direccion, telefono }); // Depuración
    const [updated] = await Cliente.update(
      { nombre, correo, direccion, telefono }, 
      { where: { id_cliente: req.params.id } }
    );
    if (!updated) {
      req.flash('error', 'Cliente no encontrado');
      return res.redirect('/clientes');
    }
    // Actualizar el usuario asociado
    await Usuario.update(
      { nombre, correo }, 
      { where: { id: req.params.id } }
    );
    req.flash('success', 'Cliente actualizado exitosamente');
    res.redirect('/clientes');
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    req.flash('error', error.message || 'Error al actualizar cliente');
    const cliente = await Cliente.findByPk(req.params.id, { raw: true }) || req.body;
    res.render('clientes/edit', { cliente, error: req.flash('error'), success: req.flash('success') });
  }
};

exports.destroy = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.session.userId) {
      req.flash('error', 'No puedes eliminar tu propio cliente');
      return res.redirect('/clientes');
    }
    const [destroyed] = await Cliente.destroy({ where: { id_cliente: req.params.id } });
    if (!destroyed) {
      req.flash('error', 'Cliente no encontrado');
      return res.redirect('/clientes');
    }
    // La eliminación del usuario asociado se maneja por CASCADE
    req.flash('success', 'Cliente eliminado exitosamente');
    res.redirect('/clientes');
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    req.flash('error', 'Error al eliminar cliente: ' + error.message);
    res.redirect('/clientes');
  }
};

exports.editOwn = async (req, res) => {
  try {
    console.log('Buscando cliente propio con ID:', req.session.userId); // Depuración
    const cliente = await Cliente.findOne({ where: { id_cliente: req.session.userId }, raw: true });
    console.log('Cliente propio encontrado:', cliente); // Depuración
    if (!cliente) {
      req.flash('error', 'Cliente no encontrado');
      return res.redirect('/cliente');
    }
    res.render('clientes/edit_own', { 
      cliente, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  } catch (error) {
    console.error('Error al cargar cliente propio para editar:', error);
    req.flash('error', 'Error al cargar tu cliente: ' + error.message);
    res.redirect('/cliente');
  }
};

exports.updateOwn = async (req, res) => {
  try {
    const { nombre, direccion, telefono, contrasena } = req.body;
    console.log('Actualizando cliente propio con ID:', req.session.userId, 'Datos:', { nombre, direccion, telefono }); // Depuración
    const [updated] = await Cliente.update(
      { nombre, direccion, telefono }, 
      { where: { id_cliente: req.session.userId } }
    );
    if (!updated) {
      req.flash('error', 'Cliente no encontrado');
      return res.redirect('/cliente');
    }
    // Actualizar nombre y contraseña del usuario asociado, si se proporciona
    const usuarioData = { nombre };
    if (contrasena) {
      usuarioData.contrasena = await bcrypt.hash(contrasena, 10);
    }
    await Usuario.update(
      usuarioData, 
      { where: { id: req.session.userId } }
    );
    req.flash('success', 'Cliente actualizado exitosamente');
    res.redirect('/cliente');
  } catch (error) {
    console.error('Error al actualizar cliente propio:', error);
    req.flash('error', error.message || 'Error al actualizar tu cliente');
    const cliente = await Cliente.findOne({ where: { id_cliente: req.session.userId }, raw: true }) || req.body;
    res.render('clientes/edit_own', { cliente, error: req.flash('error'), success: req.flash('success') });
  }
};