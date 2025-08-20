const db = require('../models');
const Pedido = db.Pedido;
const Cliente = db.Cliente;
const Comercio = db.Comercio;
const Delivery = db.Delivery;
const Usuario = db.Usuario;

exports.index = async (req, res) => {
  try {
    const where = {};
    let cliente, comercio, delivery;

    if (req.session.userType === 'cliente') {
      cliente = await Cliente.findOne({ where: { id_usuario: req.session.userId } });
      if (!cliente) {
        console.log('Cliente no encontrado para userId:', req.session.userId); // Depuración
        req.flash('error', 'Cliente no encontrado');
        return res.redirect('/');
      }
      where.id_cliente = cliente.id_cliente;
    } else if (req.session.userType === 'comercio') {
      comercio = await Comercio.findOne({ where: { id_usuario: req.session.userId } });
      if (!comercio) {
        console.log('Comercio no encontrado para userId:', req.session.userId); // Depuración
        req.flash('error', 'Comercio no encontrado');
        return res.redirect('/');
      }
      where.id_comercio = comercio.id_comercio;
    } else if (req.session.userType === 'delivery') {
      delivery = await Delivery.findOne({ where: { id_usuario: req.session.userId } });
      if (!delivery) {
        console.log('Delivery no encontrado para userId:', req.session.userId); // Depuración
        req.flash('error', 'Delivery no encontrado');
        return res.redirect('/');
      }
      where.id_delivery = delivery.id_delivery;
    } else if (req.session.userType === 'admin') {
      // Admin ve todos los pedidos
      console.log('Admin accediendo a todos los pedidos'); // Depuración
    } else {
      console.log('Tipo de usuario no válido:', req.session.userType); // Depuración
      req.flash('error', 'Acceso no autorizado');
      return res.redirect('/');
    }

    const pedidos = await Pedido.findAll({
      where,
      include: [
        { model: Cliente, include: [{ model: Usuario, attributes: ['nombre', 'correo'] }] },
        { model: Comercio, attributes: ['nombre'] },
        { model: Delivery, attributes: ['nombre'], required: false }
      ],
      raw: true
    });

    console.log('Pedidos encontrados:', pedidos); // Depuración

    res.render('pedidos/index', {
      pedidos: pedidos.map(pedido => ({
        ...pedido,
        clienteNombre: pedido['Cliente.Usuario.nombre'] || 'Desconocido',
        clienteCorreo: pedido['Cliente.Usuario.correo'] || 'Sin correo',
        comercioNombre: pedido['Comercio.nombre'] || 'Desconocido',
        deliveryNombre: pedido['Delivery.nombre'] || 'No asignado'
      })),
      success: req.flash('success'),
      error: req.flash('error'),
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    req.flash('error', 'Error al cargar pedidos');
    res.redirect('/');
  }
};

exports.create = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ where: { tipo: 'cliente' } });
    const comercios = await Comercio.findAll();
    const deliverys = await Delivery.findAll();
    res.render('pedidos/create', { 
      usuarios, 
      comercios, 
      deliverys, 
      success: req.flash('success'),
      error: req.flash('error'),
      csrfToken: req.csrfToken() 
    });
  } catch (error) {
    console.error('Error al cargar formulario de creación:', error);
    req.flash('error', 'Error al cargar formulario');
    res.redirect('/pedidos');
  }
};

exports.store = async (req, res) => {
  try {
    await Pedido.create(req.body);
    req.flash('success', 'Pedido creado exitosamente');
    res.redirect('/pedidos');
  } catch (error) {
    console.error('Error al crear pedido:', error);
    req.flash('error', 'Error al crear pedido');
    res.redirect('/pedidos/create');
  }
};

exports.edit = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [
        { model: Cliente, include: [{ model: Usuario, attributes: ['nombre', 'correo'] }] },
        { model: Comercio, attributes: ['nombre'] },
        { model: Delivery, attributes: ['nombre'], required: false }
      ]
    });
    if (!pedido) {
      req.flash('error', 'Pedido no encontrado');
      return res.redirect('/pedidos');
    }
    const usuarios = await Usuario.findAll({ where: { tipo: 'cliente' } });
    const comercios = await Comercio.findAll();
    const deliverys = await Delivery.findAll();
    res.render('pedidos/edit', { 
      pedido: {
        ...pedido.get({ plain: true }),
        clienteNombre: pedido.Cliente?.Usuario?.nombre || 'Desconocido',
        clienteCorreo: pedido.Cliente?.Usuario?.correo || 'Sin correo',
        comercioNombre: pedido.Comercio?.nombre || 'Desconocido',
        deliveryNombre: pedido.Delivery?.nombre || 'No asignado'
      }, 
      usuarios, 
      comercios, 
      deliverys, 
      success: req.flash('success'),
      error: req.flash('error'),
      csrfToken: req.csrfToken() 
    });
  } catch (error) {
    console.error('Error al cargar pedido:', error);
    req.flash('error', 'Error al cargar pedido');
    res.redirect('/pedidos');
  }
};

exports.update = async (req, res) => {
  try {
    await Pedido.update(req.body, { where: { id: req.params.id } });
    req.flash('success', 'Pedido actualizado exitosamente');
    res.redirect('/pedidos');
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    req.flash('error', 'Error al actualizar pedido');
    res.redirect(`/pedidos/edit/${req.params.id}`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Pedido.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Pedido eliminado exitosamente');
    res.redirect('/pedidos');
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    req.flash('error', 'Error al eliminar pedido');
    res.redirect('/pedidos');
  }
};