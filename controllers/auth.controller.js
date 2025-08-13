const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.showLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.showRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

exports.register = async (req, res) => {
  try {
    const { nombre, correo, contrasena, tipo } = req.body;
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await Usuario.create({
      nombre,
      correo,
      contrasena: hashedPassword,
      tipo,
    });

    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error en register:', error);
    res.render('auth/register', { error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    console.log('Intentando login con correo:', correo); // Depuración
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      console.log('Usuario no encontrado:', correo); // Depuración
      return res.render('auth/login', { error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      console.log('Contraseña incorrecta para:', correo); // Depuración
      return res.render('auth/login', { error: 'Contraseña incorrecta' });
    }

    req.session.userId = usuario.id;
    req.session.userName = usuario.nombre;
    req.session.userType = usuario.tipo;

    console.log('Login exitoso - Usuario:', usuario.correo, 'Tipo:', usuario.tipo, 'Session:', req.session); // Depuración

    switch (usuario.tipo) {
      case 'admin':
        return res.redirect('/admin');
      case 'cliente':
        return res.redirect('/cliente');
      case 'comercio':
        return res.redirect('/comercio');
      case 'delivery':
        return res.redirect('/delivery');
      default:
        return res.redirect('/');
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.render('auth/login', { error: 'Error al iniciar sesión' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).render('error', { message: 'Error al cerrar sesión' });
    }
    res.redirect('/');
  });
};