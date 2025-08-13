const { Usuario } = require('../models');

exports.isAuthenticated = async (req, res, next) => {
  console.log('Verificando autenticación - Session:', req.session); // Depuración
  if (!req.session.userId) {
    console.log('No hay userId en la sesión'); // Depuración
    return res.redirect('/auth/login');
  }

  try {
    const usuario = await Usuario.findByPk(req.session.userId);
    if (!usuario) {
      console.log('Usuario no encontrado en DB para userId:', req.session.userId); // Depuración
      return res.redirect('/auth/login');
    }
    req.user = usuario;
    next();
  } catch (error) {
    console.error('Error en isAuthenticated:', error);
    res.status(500).render('error', { message: 'Error de autenticación' });
  }
};

exports.isAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }

  try {
    const usuario = await Usuario.findByPk(req.session.userId);
    if (!usuario || usuario.tipo !== 'admin') {
      return res.status(403).render('error', { message: 'Acceso denegado: Solo administradores' });
    }
    req.user = usuario;
    next();
  } catch (error) {
    console.error('Error en isAdmin:', error);
    res.status(500).render('error', { message: 'Error de autenticación' });
  }
};

exports.isTipo = (tipo) => async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }

  try {
    const usuario = await Usuario.findByPk(req.session.userId);
    if (!usuario) {
      return res.redirect('/auth/login');
    }
    if (usuario.tipo === 'admin' || usuario.tipo === tipo) {
      req.user = usuario;
      return next();
    }
    res.status(403).render('error', { message: `Acceso denegado: Se requiere rol ${tipo} o admin` });
  } catch (error) {
    console.error(`Error en isTipo(${tipo}):`, error);
    res.status(500).render('error', { message: 'Error de autenticación' });
  }
};