const db = require('../models');
const Usuario = db.Usuario;
const Cliente = db.Cliente;
const Comercio = db.Comercio;
const Delivery = db.Delivery;
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
    const usuario = await Usuario.create({ nombre, correo, contrasena: hashed, tipo });
    
    // Crear registro en la tabla correspondiente según el tipo
    if (tipo === 'cliente') {
      await Cliente.create({ id_cliente: usuario.id, nombre, correo, direccion: 'Sin especificar', telefono: 'Sin especificar' });
    } else if (tipo === 'comercio') {
      await Comercio.create({ id_comercio: usuario.id, nombre_local: nombre, correo, direccion: 'Sin especificar', telefono: 'Sin especificar' });
    } else if (tipo === 'delivery') {
      await Delivery.create({ id_delivery: usuario.id, correo, telefono: 'Sin especificar', vehiculo_tipo: 'Sin especificar' });
    }

    req.flash('success', 'Usuario creado exitosamente');
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error al crear usuario:', error);
    req.flash('error', error.message || 'Error al crear usuario');
    res.render('usuarios/create', { 
      error: req.flash('error'), 
      nombre: req.body.nombre || '', 
      correo: req.body.correo || '', 
      tipo: req.body.tipo || '' 
    });
  }
};

exports.edit = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { raw: true });
    console.log('Usuario para editar:', usuario);
    if (!usuario) {
      req.flash('error', 'Usuario no encontrado');
      return res.redirect('/usuarios');
    }
    res.render('usuarios/edit', { usuario, error: req.flash('error'), success: req.flash('success') });
  } catch (error) {
    console.error('Error al cargar usuario para editar:', error);
    req.flash('error', 'Error al cargar usuario');
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
    // Actualizar o crear registro en la tabla correspondiente según el tipo
    if (tipo === 'cliente') {
      const [clientUpdated] = await Cliente.update(
        { nombre, correo, direccion: 'Sin especificar', telefono: 'Sin especificar' },
        { where: { id_cliente: req.params.id } }
      );
      if (!clientUpdated) {
        await Cliente.create({ id_cliente: req.params.id, nombre, correo, direccion: 'Sin especificar', telefono: 'Sin especificar' });
      }
      await Comercio.destroy({ where: { id_comercio: req.params.id } });
      await Delivery.destroy({ where: { id_delivery: req.params.id } });
    } else if (tipo === 'comercio') {
      const [comercioUpdated] = await Comercio.update(
        { nombre_local: nombre, correo, direccion: 'Sin especificar', telefono: 'Sin especificar' },
        { where: { id_comercio: req.params.id } }
      );
      if (!comercioUpdated) {
        await Comercio.create({ id_comercio: req.params.id, nombre_local: nombre, correo, direccion: 'Sin especificar', telefono: 'Sin especificar' });
      }
      await Cliente.destroy({ where: { id_cliente: req.params.id } });
      await Delivery.destroy({ where: { id_delivery: req.params.id } });
    } else if (tipo === 'delivery') {
      const [deliveryUpdated] = await Delivery.update(
        { correo, telefono: 'Sin especificar', vehiculo_tipo: 'Sin especificar' },
        { where: { id_delivery: req.params.id } }
      );
      if (!deliveryUpdated) {
        await Delivery.create({ id_delivery: req.params.id, correo, telefono: 'Sin especificar', vehiculo_tipo: 'Sin especificar' });
      }
      await Cliente.destroy({ where: { id_cliente: req.params.id } });
      await Comercio.destroy({ where: { id_comercio: req.params.id } });
    } else if (tipo === 'admin') {
      await Cliente.destroy({ where: { id_cliente: req.params.id } });
      await Comercio.destroy({ where: { id_comercio: req.params.id } });
      await Delivery.destroy({ where: { id_delivery: req.params.id } });
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
    // La eliminación en clientes, comercios, deliveries se maneja por CASCADE
    req.flash('success', 'Usuario eliminado exitosamente');
    res.redirect('/usuarios');
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    req.flash('error', 'Error al eliminar usuario');
    res.redirect('/usuarios');
  }
};