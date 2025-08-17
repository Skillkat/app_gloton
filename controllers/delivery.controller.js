const db = require('../models');
const Delivery = db.Delivery;
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');

exports.index = async (req, res) => {
  try {
    console.log('Cargando lista de deliverys...');
    const deliverys = await Delivery.findAll({ raw: true });
    const deliverysWithName = await Promise.all(deliverys.map(async (delivery) => {
      const usuario = await Usuario.findByPk(delivery.id_delivery, { attributes: ['nombre'], raw: true });
      delivery.nombre = usuario ? usuario.nombre : 'N/A';
      return delivery;
    }));
    console.log('Deliverys encontrados:', deliverysWithName);
    res.render('deliverys/index', {
      deliverys: deliverysWithName,
      message: deliverysWithName.length ? null : 'No se encontraron deliverys',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error al cargar deliverys:', error);
    req.flash('error', 'Error al cargar deliverys');
    res.render('deliverys/index', { deliverys: [], success: req.flash('success'), error: req.flash('error') });
  }
};

exports.create = (req, res) => {
  res.render('deliverys/create', { 
    error: req.flash('error'), 
    nombre: '', 
    correo: '', 
    telefono: '', 
    vehiculo_tipo: '' 
  });
};

exports.store = async (req, res) => {
  try {
    const { nombre, correo, telefono, vehiculo_tipo, contrasena } = req.body;
    console.log('Creando delivery con datos:', { nombre, correo, telefono, vehiculo_tipo }); // Depuración

    // Crear usuario asociado con tipo 'delivery'
    const hashed = await bcrypt.hash(contrasena, 10);
    const usuario = await Usuario.create({ 
      nombre, 
      correo, 
      contrasena: hashed, 
      tipo: 'delivery' 
    });

    // Crear delivery con el id del usuario
    await Delivery.create({ 
      id_delivery: usuario.id, 
      correo, 
      telefono, 
      vehiculo_tipo 
    });

    req.flash('success', 'Delivery creado exitosamente');
    res.redirect('/deliverys');
  } catch (error) {
    console.error('Error al crear delivery:', error);
    req.flash('error', error.message || 'Error al crear delivery');
    res.render('deliverys/create', { 
      error: req.flash('error'), 
      nombre: req.body.nombre || '', 
      correo: req.body.correo || '', 
      telefono: req.body.telefono || '', 
      vehiculo_tipo: req.body.vehiculo_tipo || '' 
    });
  }
};

exports.edit = async (req, res) => {
  try {
    console.log('Buscando delivery con ID:', req.params.id); // Depuración
    const delivery = await Delivery.findByPk(req.params.id, { raw: true });
    console.log('Delivery encontrado:', delivery); // Depuración
    if (!delivery) {
      req.flash('error', 'Delivery no encontrado');
      return res.redirect('/deliverys');
    }
    const usuario = await Usuario.findByPk(req.params.id, { raw: true });
    res.render('deliverys/edit', { 
      delivery: { ...delivery, nombre: usuario.nombre }, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  } catch (error) {
    console.error('Error al cargar delivery para editar:', error);
    req.flash('error', 'Error al cargar delivery: ' + error.message);
    res.redirect('/deliverys');
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, correo, telefono, vehiculo_tipo } = req.body;
    console.log('Actualizando delivery con ID:', req.params.id, 'Datos:', { nombre, correo, telefono, vehiculo_tipo }); // Depuración
    const [updated] = await Delivery.update(
      { correo, telefono, vehiculo_tipo }, 
      { where: { id_delivery: req.params.id } }
    );
    if (!updated) {
      req.flash('error', 'Delivery no encontrado');
      return res.redirect('/deliverys');
    }
    // Actualizar el usuario asociado
    await Usuario.update(
      { nombre, correo }, 
      { where: { id: req.params.id } }
    );
    req.flash('success', 'Delivery actualizado exitosamente');
    res.redirect('/deliverys');
  } catch (error) {
    console.error('Error al actualizar delivery:', error);
    req.flash('error', error.message || 'Error al actualizar delivery');
    const delivery = await Delivery.findByPk(req.params.id, { raw: true }) || req.body;
    const usuario = await Usuario.findByPk(req.params.id, { raw: true }) || { nombre: req.body.nombre };
    res.render('deliverys/edit', { 
      delivery: { ...delivery, nombre: usuario.nombre }, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.session.userId) {
      req.flash('error', 'No puedes eliminar tu propio delivery');
      return res.redirect('/deliverys');
    }
    const [destroyed] = await Delivery.destroy({ where: { id_delivery: req.params.id } });
    if (!destroyed) {
      req.flash('error', 'Delivery no encontrado');
      return res.redirect('/deliverys');
    }
    // La eliminación del usuario asociado se maneja por CASCADE en models/index.js
    req.flash('success', 'Delivery eliminado exitosamente');
    res.redirect('/deliverys');
  } catch (error) {
    console.error('Error al eliminar delivery:', error);
    req.flash('error', 'Error al eliminar delivery: ' + error.message);
    res.redirect('/deliverys');
  }
};

exports.editOwn = async (req, res) => {
  try {
    console.log('Buscando delivery propio con ID:', req.session.userId); // Depuración
    const delivery = await Delivery.findOne({ where: { id_delivery: req.session.userId }, raw: true });
    console.log('Delivery propio encontrado:', delivery); // Depuración
    if (!delivery) {
      req.flash('error', 'Delivery no encontrado');
      return res.redirect('/delivery');
    }
    const usuario = await Usuario.findByPk(req.session.userId, { raw: true });
    res.render('deliverys/edit_own', { 
      delivery: { ...delivery, nombre: usuario.nombre }, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  } catch (error) {
    console.error('Error al cargar delivery propio para editar:', error);
    req.flash('error', 'Error al cargar tu delivery: ' + error.message);
    res.redirect('/delivery');
  }
};

exports.updateOwn = async (req, res) => {
  try {
    const { nombre, telefono, vehiculo_tipo, contrasena } = req.body;
    console.log('Actualizando delivery propio con ID:', req.session.userId, 'Datos:', { nombre, telefono, vehiculo_tipo });
    const [updated] = await Delivery.update(
      { telefono, vehiculo_tipo }, 
      { where: { id_delivery: req.session.userId } }
    );
    if (!updated) {
      req.flash('error', 'Delivery no encontrado');
      return res.redirect('/delivery');
    }
    const usuarioData = { nombre };
    if (contrasena) {
      usuarioData.contrasena = await bcrypt.hash(contrasena, 10);
    }
    await Usuario.update(
      usuarioData, 
      { where: { id: req.session.userId } }
    );
    req.flash('success', 'Delivery actualizado exitosamente');
    res.redirect('/delivery');
  } catch (error) {
    console.error('Error al actualizar delivery propio:', error);
    req.flash('error', error.message || 'Error al actualizar tu delivery');
    const delivery = await Delivery.findOne({ where: { id_delivery: req.session.userId }, raw: true }) || req.body;
    const usuario = await Usuario.findByPk(req.session.userId, { raw: true }) || { nombre: req.body.nombre };
    res.render('deliverys/edit_own', { 
      delivery: { ...delivery, nombre: usuario.nombre }, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  }
};
