const db = require('../models');
const Comercio = db.Comercio;
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');

exports.index = async (req, res) => {
  try {
    console.log('Cargando lista de comercios...');
    const comercios = await Comercio.findAll({ raw: true });
    console.log('Comercios encontrados:', comercios);
    res.render('comercios/index', { 
      comercios,
      message: comercios.length ? null : 'No se encontraron comercios',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error al cargar comercios:', error);
    req.flash('error', 'Error al cargar comercios');
    res.render('comercios/index', { comercios: [], success: req.flash('success'), error: req.flash('error') });
  }
};

exports.create = (req, res) => {
  res.render('comercios/create', { 
    error: req.flash('error'), 
    nombre_local: '', 
    correo: '', 
    direccion: '', 
    telefono: '', 
    horario_apertura: '', 
    horario_cierre: '' 
  });
};

exports.store = async (req, res) => {
  try {
    const { nombre_local, correo, direccion, telefono, horario_apertura, horario_cierre, contrasena } = req.body;
    console.log('Creando comercio con datos:', { nombre_local, correo, direccion, telefono, horario_apertura, horario_cierre }); // Depuración

    // Crear usuario asociado con tipo 'comercio'
    const hashed = await bcrypt.hash(contrasena, 10);
    const usuario = await Usuario.create({ 
      nombre: nombre_local, 
      correo, 
      contrasena: hashed, 
      tipo: 'comercio' 
    });

    // Crear comercio con el id del usuario
    await Comercio.create({ 
      id_comercio: usuario.id, 
      nombre_local, 
      correo, 
      direccion, 
      telefono, 
      horario_apertura, 
      horario_cierre 
    });

    req.flash('success', 'Comercio creado exitosamente');
    res.redirect('/comercios');
  } catch (error) {
    console.error('Error al crear comercio:', error);
    req.flash('error', error.message || 'Error al crear comercio');
    res.render('comercios/create', { 
      error: req.flash('error'), 
      nombre_local: req.body.nombre_local || '', 
      correo: req.body.correo || '', 
      direccion: req.body.direccion || '', 
      telefono: req.body.telefono || '', 
      horario_apertura: req.body.horario_apertura || '', 
      horario_cierre: req.body.horario_cierre || '' 
    });
  }
};

exports.edit = async (req, res) => {
  try {
    console.log('Buscando comercio con ID:', req.params.id); // Depuración
    const comercio = await Comercio.findByPk(req.params.id, { raw: true });
    console.log('Comercio encontrado:', comercio); // Depuración
    if (!comercio) {
      req.flash('error', 'Comercio no encontrado');
      return res.redirect('/comercios');
    }
    res.render('comercios/edit', { 
      comercio, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  } catch (error) {
    console.error('Error al cargar comercio para editar:', error);
    req.flash('error', 'Error al cargar comercio: ' + error.message);
    res.redirect('/comercios');
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre_local, correo, direccion, telefono, horario_apertura, horario_cierre } = req.body;
    console.log('Actualizando comercio con ID:', req.params.id, 'Datos:', { nombre_local, correo, direccion, telefono, horario_apertura, horario_cierre }); // Depuración
    const [updated] = await Comercio.update(
      { nombre_local, correo, direccion, telefono, horario_apertura, horario_cierre }, 
      { where: { id_comercio: req.params.id } }
    );
    if (!updated) {
      req.flash('error', 'Comercio no encontrado');
      return res.redirect('/comercios');
    }
    // Actualizar el usuario asociado
    await Usuario.update(
      { nombre: nombre_local, correo }, 
      { where: { id: req.params.id } }
    );
    req.flash('success', 'Comercio actualizado exitosamente');
    res.redirect('/comercios');
  } catch (error) {
    console.error('Error al actualizar comercio:', error);
    req.flash('error', error.message || 'Error al actualizar comercio');
    const comercio = await Comercio.findByPk(req.params.id, { raw: true }) || req.body;
    res.render('comercios/edit', { comercio, error: req.flash('error'), success: req.flash('success') });
  }
};

exports.destroy = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.session.userId) {
      req.flash('error', 'No puedes eliminar tu propio comercio');
      return res.redirect('/comercios');
    }
    const [destroyed] = await Comercio.destroy({ where: { id_comercio: req.params.id } });
    if (!destroyed) {
      req.flash('error', 'Comercio no encontrado');
      return res.redirect('/comercios');
    }
    // La eliminación del usuario asociado se maneja por CASCADE
    req.flash('success', 'Comercio eliminado exitosamente');
    res.redirect('/comercios');
  } catch (error) {
    console.error('Error al eliminar comercio:', error);
    req.flash('error', 'Error al eliminar comercio: ' + error.message);
    res.redirect('/comercios');
  }
};

exports.editOwn = async (req, res) => {
  try {
    console.log('Buscando comercio propio con ID:', req.session.userId); // Depuración
    const comercio = await Comercio.findOne({ where: { id_comercio: req.session.userId }, raw: true });
    console.log('Comercio propio encontrado:', comercio); // Depuración
    if (!comercio) {
      req.flash('error', 'Comercio no encontrado');
      return res.redirect('/comercio');
    }
    res.render('comercios/edit_own', { 
      comercio, 
      error: req.flash('error'), 
      success: req.flash('success') 
    });
  } catch (error) {
    console.error('Error al cargar comercio propio para editar:', error);
    req.flash('error', 'Error al cargar tu comercio: ' + error.message);
    res.redirect('/comercio');
  }
};

exports.updateOwn = async (req, res) => {
  try {
    const { nombre_local, direccion, telefono, horario_apertura, horario_cierre, contrasena } = req.body;
    console.log('Actualizando comercio propio con ID:', req.session.userId, 'Datos:', { nombre_local, direccion, telefono, horario_apertura, horario_cierre }); // Depuración
    const [updated] = await Comercio.update(
      { nombre_local, direccion, telefono, horario_apertura, horario_cierre }, 
      { where: { id_comercio: req.session.userId } }
    );
    if (!updated) {
      req.flash('error', 'Comercio no encontrado');
      return res.redirect('/comercio');
    }
    // Actualizar nombre y contraseña del usuario asociado, si se proporciona
    const usuarioData = { nombre: nombre_local };
    if (contrasena) {
      usuarioData.contrasena = await bcrypt.hash(contrasena, 10);
    }
    await Usuario.update(
      usuarioData, 
      { where: { id: req.session.userId } }
    );
    req.flash('success', 'Comercio actualizado exitosamente');
    res.redirect('/comercio');
  } catch (error) {
    console.error('Error al actualizar comercio propio:', error);
    req.flash('error', error.message || 'Error al actualizar tu comercio');
    const comercio = await Comercio.findOne({ where: { id_comercio: req.session.userId }, raw: true }) || req.body;
    res.render('comercios/edit_own', { comercio, error: req.flash('error'), success: req.flash('success') });
  }
};