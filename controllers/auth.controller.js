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
    const { nombre, correo, password, tipo } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
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
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.render('auth/login', { error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, usuario.contrasena);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Contraseña incorrecta' });
    }

    // Guardar datos en sesión
    req.session.usuarioId = usuario.id;
    req.session.usuarioNombre = usuario.nombre;
    req.session.usuarioTipo = usuario.tipo;

    // Redirección según el tipo de usuario
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
        return res.redirect('/'); // fallback
    }
  } catch (error) {
    console.error(error);
    res.render('auth/login', { error: 'Error en login' });
  }
};

