const db = require('../models');
const Producto = db.Producto;
const Pedido = db.Pedido;
const DetallePedido = db.DetallePedido;

exports.agregar = async (req, res) => {
  try {
    const { id_producto, cantidad } = req.body;
    const producto = await Producto.findByPk(id_producto, { raw: true });
    if (!producto || !producto.disponible) {
      req.flash('error', 'Producto no encontrado o no disponible');
      return res.redirect('/');
    }

    // Inicializar carrito en la sesión si no existe
    if (!req.session.carrito) {
      req.session.carrito = [];
    }

    // Buscar si el producto ya está en el carrito
    const itemIndex = req.session.carrito.findIndex(item => item.id_producto === parseInt(id_producto));
    if (itemIndex >= 0) {
      // Actualizar cantidad si ya existe
      req.session.carrito[itemIndex].cantidad += parseInt(cantidad);
    } else {
      // Agregar nuevo ítem
      req.session.carrito.push({
        id_producto: parseInt(id_producto),
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        cantidad: parseInt(cantidad),
        imagen_url: producto.imagen_url
      });
    }

    req.flash('success', 'Producto agregado al carrito');
    res.redirect('/');
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    req.flash('error', 'Error al agregar al carrito');
    res.redirect('/');
  }
};

exports.index = async (req, res) => {
  try {
    const carrito = req.session.carrito || [];
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2);
    res.render('carrito/index', {
      carrito,
      total,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error al mostrar carrito:', error);
    req.flash('error', 'Error al mostrar carrito');
    res.render('carrito/index', { carrito: [], total: 0, success: req.flash('success'), error: req.flash('error') });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id_producto, cantidad } = req.body;
    if (!req.session.carrito) {
      req.flash('error', 'Carrito vacío');
      return res.redirect('/carrito');
    }

    const itemIndex = req.session.carrito.findIndex(item => item.id_producto === parseInt(id_producto));
    if (itemIndex >= 0) {
      if (parseInt(cantidad) <= 0) {
        req.session.carrito.splice(itemIndex, 1); // Eliminar si cantidad es 0
      } else {
        req.session.carrito[itemIndex].cantidad = parseInt(cantidad);
      }
      req.flash('success', 'Carrito actualizado');
    } else {
      req.flash('error', 'Producto no encontrado en el carrito');
    }
    res.redirect('/carrito');
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    req.flash('error', 'Error al actualizar carrito');
    res.redirect('/carrito');
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id_producto } = req.params;
    if (!req.session.carrito) {
      req.flash('error', 'Carrito vacío');
      return res.redirect('/carrito');
    }

    req.session.carrito = req.session.carrito.filter(item => item.id_producto !== parseInt(id_producto));
    req.flash('success', 'Producto eliminado del carrito');
    res.redirect('/carrito');
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    req.flash('error', 'Error al eliminar del carrito');
    res.redirect('/carrito');
  }
};

exports.confirmar = async (req, res) => {
  try {
    if (!req.session.userId || req.session.userType !== 'cliente') {
      req.flash('error', 'Debes iniciar sesión como cliente para confirmar un pedido');
      return res.redirect('/auth/login');
    }

    if (!req.session.carrito || req.session.carrito.length === 0) {
      req.flash('error', 'El carrito está vacío');
      return res.redirect('/carrito');
    }

    // Crear pedido
    const pedido = await Pedido.create({
      id_cliente: req.session.userId,
      id_comercio: req.session.carrito[0].id_comercio, // Asumimos que todos los productos son del mismo comercio
      id_delivery: null, // Por ahora, sin asignar delivery
      estado: 'pendiente',
      fecha: new Date()
    });

    // Crear detalles del pedido
    for (const item of req.session.carrito) {
      await DetallePedido.create({
        id_pedido: pedido.id,
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      });
    }

    // Limpiar carrito
    req.session.carrito = [];
    req.flash('success', 'Pedido confirmado exitosamente');
    res.redirect('/pedidos');
  } catch (error) {
    console.error('Error al confirmar pedido:', error);
    req.flash('error', 'Error al confirmar pedido');
    res.redirect('/carrito');
  }
};