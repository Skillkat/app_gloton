const db = require('../models');
const Producto = db.Producto;
const path = require('path');

exports.index = async (req, res) => {
  try {
    const user = res.locals.user;
    const where = user.tipo === 'comercio' ? { id_comercio: user.id } : {};
    const productos = await Producto.findAll({ where, raw: true });
    console.log('Productos encontrados:', productos);
    res.render('productos/index.hbs', { 
      productos,
      message: productos.length ? null : 'No se encontraron productos',
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    req.flash('error', 'Error al cargar productos');
    res.render('productos/index.hbs', { productos: [], success: req.flash('success'), error: req.flash('error') });
  }
};

exports.create = (req, res) => {
  res.render('productos/create.hbs', { error: req.flash('error'), success: req.flash('success') });
};

exports.store = async (req, res) => {
  try {
    const user = res.locals.user;
    const { nombre, descripcion, precio, disponible } = req.body;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;
    if (!nombre || !precio) {
      throw new Error('Nombre y precio son obligatorios');
    }
    const productoData = {
      id_comercio: user.tipo === 'comercio' ? user.id : req.body.id_comercio,
      nombre,
      descripcion,
      precio: parseFloat(precio),
      imagen_url,
      disponible: disponible === 'on' ? 1 : 0
    };
    console.log('Creando producto con datos:', productoData);
    await Producto.create(productoData);
    req.flash('success', 'Producto creado exitosamente');
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al crear producto:', error);
    req.flash('error', error.message || 'Error al crear producto');
    res.render('productos/create.hbs', { error: req.flash('error'), success: req.flash('success'), ...req.body });
  }
};

exports.edit = async (req, res) => {
  try {
    const user = res.locals.user;
    const where = user.tipo === 'comercio' ? { id: req.params.id, id_comercio: user.id } : { id: req.params.id };
    const producto = await Producto.findOne({ where, raw: true });
    if (!producto) {
      req.flash('error', 'Producto no encontrado o no tienes permiso');
      return res.redirect('/productos');
    }
    console.log('Producto para editar:', producto);
    res.render('productos/edit.hbs', { producto, error: req.flash('error'), success: req.flash('success') });
  } catch (error) {
    console.error('Error al cargar producto para editar:', error);
    req.flash('error', 'Error al cargar producto');
    res.redirect('/productos');
  }
};

exports.update = async (req, res) => {
  try {
    const user = res.locals.user;
    const where = user.tipo === 'comercio' ? { id: req.params.id, id_comercio: user.id } : { id: req.params.id };
    const { nombre, descripcion, precio, disponible, imagen_url: existingImagenUrl } = req.body;
    if (!nombre || !precio) {
      throw new Error('Nombre y precio son obligatorios');
    }
    const productoData = {
      nombre,
      descripcion: descripcion || null,
      precio: parseFloat(precio),
      imagen_url: req.file ? `/uploads/${req.file.filename}` : existingImagenUrl || null,
      disponible: disponible === 'on' ? 1 : 0
    };
    console.log('Actualizando producto con datos:', productoData, 'where:', where);
    const [updated] = await Producto.update(productoData, { where });
    if (!updated) {
      throw new Error('Producto no encontrado o no tienes permiso');
    }
    req.flash('success', 'Producto actualizado exitosamente');
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    req.flash('error', error.message || 'Error al actualizar producto');
    const producto = await Producto.findByPk(req.params.id, { raw: true }) || { ...req.body, imagen_url: req.body.imagen_url || null };
    res.render('productos/edit.hbs', { producto, error: req.flash('error'), success: req.flash('success') });
  }
};

exports.destroy = async (req, res) => {
  try {
    const user = res.locals.user;
    const where = user.tipo === 'comercio' ? { id: req.params.id, id_comercio: user.id } : { id: req.params.id };
    const [destroyed] = await Producto.destroy({ where });
    if (!destroyed) {
      req.flash('error', 'Producto no encontrado o no tienes permiso');
      return res.redirect('/productos');
    }
    req.flash('success', 'Producto eliminado exitosamente');
    res.redirect('/productos');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    req.flash('error', 'Error al eliminar producto');
    res.redirect('/productos');
  }
};