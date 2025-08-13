const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');

exports.showLogin = (req, res) => {
  res.render('auth/login');
};

exports.showRegister = (req, res) => {
  res.render('auth/register');
};

exports.register = async (req, res) => {
  try {
    const { nombre, correo, contrasena, tipo } = req.body; // Cambiado de password a contrasena
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await Usuario.create({
      nombre,
      correo,
      contrasena: hashedPassword,
      tipo,
    });

    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.render('auth/register', { error: 'Error al registrar usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body; // Cambiado de password
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.render('auth/login', { error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Contraseña incorrecta' });
    }

    req.session.usuarioId = usuario.id;
    req.session.usuarioNombre = usuario.nombre;
    req.session.usuarioTipo = usuario.tipo;

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
    console.error(error);
    res.render('auth/login', { error: 'Error en login' });
  }
};

exports.logout = (req, res) => { // Agregado
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/');
  });
};